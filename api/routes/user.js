const userController = require("../controllers/userController")
const express = require('express');
const rateLimit = require('express-rate-limiter');
var router = require('express').Router();




router.post("/login", userController.login_user);
router.post("/register", userController.registerUser);
router.post("/logout", userController.logout_user);


router.get("/test", (req, res) => {
    res.status(200);
    res.send("Success!");
});

module.exports = router;