var nm = require('nodemailer');
const Verification = require('../models/Verification');
var templates = require('./templates');

transporter = nm.createTransport({
    host: 'smtp.gmail.com' ,
    port: 587,
    secure: false,
    auth: {
        user: 'winf2021.2022@gmail.com',
        pass: process.env['GMAIL_PASSWORD']
    }
});

console.log("Verifying mail server connection!");

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Connected to mail server.");
    }
});

console.log("Trying to log into gmail with username winf2021.2022@gmail.com and password " + process.env['GMAIL_PASSWORD']);
templates.loadTemplate(__dirname + "/templates/verification_message.html", "verification_message");
templates.loadTemplate(__dirname + "/templates/forgot_password_code.html", "forgot_password_code");
templates.loadTemplate(__dirname + "/templates/server_status.html", "server_status").then((res) => {
    exports.sendStatusEmail('jak.tinhofer@billrothgymnasium.at',
        'Server Online',
        `Hi there! The WINF server is now online at <a href="${process.env['HOSTNAME']}">${process.env['HOSTNAME']}</a> and ready! Development mode: ${(process.env['DEV_MODE'])}`,
        'royalblue');
    console.debug(process.env['DEV_MODE']);
    console.log("Sent server online email!");
}, (error) => {console.log("ERROR: " + error)});


exports.sendStatusEmail = async (rec, status_title, status_message, status_color) => {
    var mailOptions = {
        from: 'WINF 2021 / 2022',
        to: rec,
        subject: status_title,
        text: "HTML version unable to load. " + status_title + ".\n" + status_message,
        html: (await templates.getTemplate("server_status")).build({
            status_title: status_title,
            status_color: status_color,
            status_message: status_message
        })
    }
    //return await transporter.sendMail(mailOptions);
}

exports.sendVerificationEmail = async (verification) => {
    let link = process.env['HOSTNAME'] + "/verify?secret=" + verification.secret;
    var mailOptions = {
        from: 'WINF 2021 / 2022',
        to: verification.user.email,
        subject: 'Activate your account',
        text: 'The HTML version of this email was unable to load. Please activate your account by clicking this link: ' + link + "You did not request this activation? Feel free to just ignore this email.",
        html: (await templates.getTemplate("verification_message")).build({
            username: verification.user.username,
            activate_link: link
        })
    }
    return await transporter.sendMail(mailOptions);
}

exports.sendForgotPasswordCode = async (user, secret) => {
    let link = process.env['HOSTNAME'] + "/changepassword?secret=" + secret;
    var mailOptions = {
        from: 'WINF 2021 / 2022',
        to: user.email,
        subject: 'Forgot Password?',
        text: 'The HTML version of this email was unable to load. Please click on the link below in order to change your password. This link is valid for only 5 minutes.\n' + link + "\nDid not request a password change? Please ignore this email.",
        html: (await templates.getTemplate("forgot_password_code")).build({
            username: user.username,
            password_link: link
        })
    }
    return await transporter.sendMail(mailOptions);
}

