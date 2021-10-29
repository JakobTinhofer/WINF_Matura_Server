let mongoose = require("mongoose");
const User = require("../models/User");
const Verification = require("../models/Verification");
const Error = require("../classes/Error");
const SuccessMessage = require("../classes/SuccessMessage");
const session = require("express-session");
const mailer = require("../mail/mailer")
const statusController = require("./statusController");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
    const {username,email, password, password2} = req.fields ? req.fields: req.query;
    console.log('Register User Attempt: Username: "' + username+ '"and email: "' + email+ '"');
    if(!username || !email || !password || !password2) {
        statusController.putJSONError(req, res, new Error("Register Error", "Please provide all fields!", 400, -1));
        console.log("Register User Attempt failed since not all fields have been provided.");
        return;
    }

    if(password != password2){
        statusController.putJSONError(req, res, new Error("Register Error", "Passwords must match!", 400, 2));
        console.log("Register User Attempt failed since passwords fields do not match.");
        return;
    }

    if(password.length < 6 || password.length > 256){
        statusController.putJSONError(req, res, new Error("Register Error", "Password must be between 6 and 256 characters long.", 400, 2));
        console.log("Register User Attempt failed since password was not between 6 and 256 characters.");
        return;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(username).toLocaleLowerCase())){
        statusController.putJSONError(req, res, new Error("Register Error", "Please, do not provide an email as a username. There is an email field for that. ;)", 400, 1));
        console.log("Register User Attempt failed since some 'fatneek' thought username was where you put your email. Mad.");
        return;
    }

    if(!re.test(String(email).toLocaleLowerCase())){
        statusController.putJSONError(req, res, new Error("Register Error", "Please provide a valid email address.", 400, 0));
        console.log("Register User Attempt failed since the email was invalid.");
        return;
    }

    if(username.length < 4 || username.length > 40){
        statusController.putJSONError(req, res, new Error("Register Error", "Please choose a user name between 4 and 40 characters long.", 400, 1));
        console.log("Register User Attempt failed since the username was not between 4 and 40 characters long.");
        return;
    }     
    const invalidChars = /[*|\",\/:<>?[\]{}`\\()';@&$]/
    if(invalidChars.test(username)){
        statusController.putJSONError(req, res, new Error("Register Error", "The username can not contain these characters: * | " + '"' + " , / : < > ? [ ] { } ` \\ () ' ; @ & $", 400, 1));
        console.log("Register User Attempt failed since username contained special chars.");
        return;
    }

    User.find({$or: [{email: email}, {username: username}]}).exec((err, users) =>{
        if(users && users.length > 0){
            user = users[0];
            if(user.email == email){
                statusController.putJSONError(req, res, new Error("Register Error", "This email is already registered. Maybe try logging in?", 400, 0));
                
            }else{
                statusController.putJSONError(req, res, new Error("Register Error", "This username is already taken. Please try another one.", 400, 1))
            }
            console.log("Register User Attempt failed since email or username was not unique.");
            return;
        }
        const newUser = new User({
            email: email,
            username: username,
            sec_level: 0,
            password_hash: password,
            verified: false
        });

        bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password_hash, salt, (err,hash)=> {
                if(err){
                    console.log("Error while trying to hash user password: " + err + "!!!! Register Attempt Failed.");
                    statusController.putJSONError(req, res, new Error("Register Error", "Internal Error while trying to hash password.", 500));
                    return;
                }
                //save pass to hash
                newUser.password_hash = hash;
                //save user
                newUser.save()
                .then(async (value)=>{
                    console.log(value);
                    await mailer.sendVerificationEmail(await Verification.getOrCreateNew(newUser));
                    console.log("Sent verification email!");
                }).catch(value=> console.log(value));
                      
            })
        );
        console.log("User created successfully!");
        statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully registered user."));
        return;
    });
}
exports.require_login = async (req, res) => {

}
exports.verify_user = async (req, res) => {
    let {secret} = req.fields ? req.fields: req.query;

    console.log("Trying to verify user with secret " + secret);

    let ver = await Verification.find({secret: secret});

    if(!ver || ver.length < 1){
        statusController.putJSONError(req, res, new Error("Verification Error", "The verify link seems to be wrong... don't know if you or we messed up here...", 404, 0));
        console.log("Could not verify user since verify secret was not found in database.");
        return;
    }
    if(ver.length > 1){
        statusController.putJSONError(req, res, new Error("Verification Error", "Double entry in DB. If this were my job, I'd get fired.", 500, 1));
        console.log("Fatal error: double entry for verification secret!");
        return;
    }
    const verification = ver[0];

    if(verification.alreadyVerified){
        statusController.putJSONSuccess(req, res, new SuccessMessage("You were already verified!", verification.user));
        console.log("User " + verification.user.username + " tried to verify, but is already verified!");
        return;
    }

    statusController.putJSONSuccess(req, res, new SuccessMessage("Account verified!", verification.user));

    let user = await User.findById(verification.user._id);
    user.verified = true;

    await user.save();
    verification.alreadyVerified = true;
    verification.save();
    console.log("Successfully verified user!");
}
exports.check_login_status = async (req, res) => {
    if(req.session && req.session.authenticated){
        res.json(JSON.stringify({'authenticated' : req.session.authenticated}));
    }else{
        res.json(JSON.stringify({'authenticated' : false}));
    }
        
}
exports.logout_user = async (req, res) => {
    if(!req.session || !req.session.user){
        console.log("Logout attempt failed since already not logged in.");
        statusController.putJSONError(req, res, new Error("Logout Error", "You need to be logged in in order to log out."));
        return;
    }
    console.log("User " + req.session.user.username + " logged out.");
    req.session.destroy();
    statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully logged out."));

}


exports.login_user = async (req, res) => {
    if(req.session && req.session.authenticated){
        console.log("Login attempt while already logged in!");
        statusController.putJSONError(req, res, new Error("Login Error", "You are already logged in! Please log out first."));
        return;
    }

    const {usernameOrEmail, password, rememberMe} = req.fields ? req.fields: req.query;
    console.log("Login attempt with username/email '" + usernameOrEmail + "' and rememberMe='" + rememberMe + "'.");

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let userQuerry;
    if(re.test(String(usernameOrEmail).toLocaleLowerCase())){
        userQuerry = await User.find({email: usernameOrEmail});
    }else{
        userQuerry = await User.find({username: usernameOrEmail});
    }

    if(!userQuerry || userQuerry.length != 1){
        console.log("Login attempt failed since email or username was not found!");
        statusController.putJSONError(req, res, new Error("Login Error", "Invalid Credentials", 403));
        return;
    }

    const user = userQuerry[0];
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if(err){
            console.log("Error encountered while checking password for " + usernameOrEmail + ". Error: " + err);
            statusController.putJSONError(req, res, new Error("Login Error", "Internal error while checking credentials. Sorry 'bout that.", 500));
            return;
        }
        if(isMatch){
            req.session.user = user;
            req.session.authenticated = true;
            console.log("User '" + user.username + "' logged in succesfully!");
            if(rememberMe == "true" || rememberMe == "on"){
                req.session.cookie.maxAge =  1000 * 60 * 60 * 24 * 60 ;
            }
            statusController.putJSONSuccess(req, res, new SuccessMessage("Login Successfull.", userToUserInfo(user)));
            return;
        }else{
            console.log("Login attempt with invalid credentials.");
            statusController.putJSONError(req, res, new Error("Login Error", "Invalid Credentials", 403));
            return;
        }

    });
}

function userToUserInfo(user){
    return {
        username: user.username,
        email: user.email,
        sec_level: user.sec_level,
        created: user.created,
        verified: user.verified
    }
}

exports.getUserInfo = async (req, res) => {
    const {username} = req.fields ? req.fields: req.query;
    if(!req.session || req.session.authenticated !== true){
        statusController.putJSONError(req, res, new Error("Get User Info Error", "Please sign in in order to get user info.", 403, 999));
        console.log("Unauthenticated user tried to get user info.");
        return;
    }

    if(username !== undefined && username !== req.session.user.username && req.session.user.sec_level < 5){
        statusController.putJSONError(req, res, new Error("Get User Info Error", "You are not authorized to query user info that is not yours.", 403, 3));
        console.log("User " + req.session.user.username + " tried to get info about " + username + " but does only have a sec rank of " + req.session.user.sec_level + ".");
        return;
    }

    if(username === undefined || username === req.session.user.username){
        
        res.json(JSON.stringify(userToUserInfo(req.session.user)));
        return;
    }

    else{
        statusController.putJSONError(req, res, new Error("Not yet implemented!", "Sorry, this feature has not yet been implemented.", 501))
        console.log("User " + req.session.user.username + " tried to get info about " + username + " but this is not yet implemented.");
        return;
    }
}