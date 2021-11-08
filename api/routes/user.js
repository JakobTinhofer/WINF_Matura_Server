const userController = require("../controllers/userController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const express = require('express');
const rateLimit = require("express-rate-limit");
var router = require('express').Router();

if(!process.env["DEV_MODE"]){
    router.use("/login", rateLimit({
        windowMs: 1000 * 60 * 60,
        max: 60,
        message: "No more than 60 login requests per hour!" 
    }));
    
    router.use("/login", rateLimit({
        windowMs: 5000, // 1 hour window
        max: 2, // start blocking after 5 requests
        message: "Too many login attempts!"
    }));

    router.use("/register", rateLimit({
        windowMs: 5000, // 1 hour window
        max: 1, // start blocking after 5 requests
        message: "Too many signup attempts!"
    }));
}



router.post("/login", userController.login_user);
router.post("/register", userController.registerUser);
router.post("/logout", userController.logout_user);
router.post("/check", userController.check_login_status);
router.post("/userinfo", userController.getUserInfo);
router.post("/verify", userController.verify_user);
router.post("/resend_verification", userController.resend_verification);

router.post("/forgotpassword", forgotPasswordController.sendForgotPassword);
router.post("/changepassword", forgotPasswordController.changePassword);

router.get("/test", (req, res) => {
    res.status(200);
    res.send("Success!");
});

module.exports = router;