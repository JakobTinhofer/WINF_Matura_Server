const User = require("../models/User") 
const mailer = require("../mail/mailer")
const helpers = require("../helpers")
const statusController = require("./statusController")
const Error = require("../classes/Error");
const SuccessMessage = require("../classes/SuccessMessage");
const validator = require("../../common/validators");
let codes = [];

exports.sendForgotPassword = async (req, res) => {
    let {email} = req.body;
    console.log("Forgot password request for email: " + email);
    let rs = validator.validateEmail(email);
    if(!rs[0]){
        statusController.putJSONError(req, res, new Error("Forgot password Error", rs[2], 400, 0));
        console.log("Forgot password request failed since email invalid: " + rs[2]);
        return;
    }

    console.log("Received forgot password request for email " + email);
    statusController.putJSONSuccess(req, res, new SuccessMessage("Received request."));
    let user = await User.findOne({email: email});

    if(user){
        let secret = await helpers.generateNewSecret();
        codes[secret] = [Date.now() + 5 * 1000 * 60, user];
        mailer.sendForgotPasswordCode(user, secret);
        console.log("Sent forgot password email to " + user.email + " with secret = " + secret);
        return;
    }else{
        console.log("Dropping forgot password request since no user with given email found.");
        return;
    }

}

exports.changePassword = async (req, res) => {
    let {secret, password, password2} = req.body;

    if(!password || !password2 || !secret){
        statusController.putJSONError(req, res, new Error("Change Password Error", "Please fill out all fields!"));
        console.log("Could not change password since one of the parameters was not provided");
        return;
    }

    console.log("Received change password request. Secret: " + secret);

    if(!secret || !codes[secret]){
        statusController.putJSONError(req, res, new Error("Change Password Error", "Invalid secret. Maybe you clicked the wrong link?", 404, 0));
        console.log("Could not change password since secret was invalid.");
        return;
    }

    if(codes[secret][0] <= Date.now()){
        statusController.putJSONError(req, res, new Error("Change Password Error", "Sorry, this link has expired", 404, 1));
        console.log("Could not change password since link has expired.");
        return;
    }

    if(password !== password2){
        statusController.putJSONError(req, res, new Error("Change Password Error", "Your passwords do not match!", 400, 2));
        console.log("Could not change password since given passwords do not match.");
        return;
    }

    const rs = validator.validatePassword(password);
    if(rs[0] !== true){
        statusController.putJSONError(req, res, new Error("Change Password Error", rs[1], 400, 3));
        console.log("Invalid password.");
        return;
    }

    let user = await User.findById(codes[secret][1]._id);

    if(!user){
        statusController.putJSONError(req, res, new Error("Change Password Error", "Sorry, somehow we did not find the user connected to that secret. Might get me fired.", 500, 3));
        console.log("Fatal error: User connected to secret not found in database.");
        return;
    }

    codes[secret] = undefined;

    user.password_hash = await helpers.hashPassword(password);
    user.save();
    statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully udated your password"));
    console.log("Password successfully updated!");
}


