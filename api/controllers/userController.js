let mongoose = require("mongoose");
const User = require("../models/User");
const Verification = require("../models/Verification");
const Error = require("../classes/Error");
const SuccessMessage = require("../classes/SuccessMessage");
const session = require("express-session");
const mailer = require("../mail/mailer")
const helpers = require("../helpers")
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

    
    
    
    let rs= helpers.validateEmail(email);
    if(!rs[0]){
        statusController.putJSONError(req, res, new Error("Register Error", rs[2], 400, 0));
        console.log("Register user attempt failed since email invalid: " + rs[2]);
        return;
    }
    
    rs = helpers.validatePassword(password)
    if(!rs[0]){
        statusController.putJSONError(req, res, new Error("Register Error", rs[2], 400, 2));
        console.log("Register user attempt failed since password invalid: " + rs[2]);
        return;
    }

    rs = helpers.validateUsername(username);
    if(!rs[0]){
        statusController.putJSONError(req, res, new Error("Register Error", rs[2], 400, 1));
        console.log("Register user attempt failed since username invalid: " + rs[2]);
        return;
    }

    

    let uq = await User.find({$or: [{email: email}, {username: username}]});

    if(uq && uq.length > 0){
        let user = uq[0];
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

    newUser.password_hash = await helpers.hashPassword(password);
    await newUser.save();
    await mailer.sendVerificationEmail(await Verification.getOrCreateNew(newUser));
    console.log("Sent verification email!");
    console.log("User created successfully!");
    statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully registered user."));
    return;
}

exports.require_login = async (req, res) => {

}

exports.verify_user = async (req, res) => {
    let {secret} = req.fields ? req.fields: req.query;

    console.log("Trying to verify user...");

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

exports.resend_verification = async (req, res) => {
    let {email} = req.fields ? req.fields: req.query;

    console.log("Received resend verification request for user " + email + ".");

    statusController.putJSONSuccess(req, res, new SuccessMessage("Received request."));

    let user = await User.findOne({email: email});


    if(!user){
        console.log("Dropping resend verification request since user does not exist.");
        return;        
    }

    if(user.verified){
        console.log("Dropping resend verification request since user is already verified.");
        return;
    }

    let verification = await Verification.getOrCreateNew(user);
    mailer.sendVerificationEmail(verification);
    console.log("Resent verification email");
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
            if(user.verified !== true){
                statusController.putJSONError(req, res, new Error("Login Error", "Your account has not yet been activated! Please check your emails.", 403, 0));
                console.log("Blocked login since account has not yet been activated.");
                return;
            }

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

