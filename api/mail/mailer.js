var nm = require('nodemailer');
var templates = require('./templates');

transporter = nm.createTransport({
    service: 'gmail',
    auth: {
        user: 'winf2021.2022@gmail.com',
        pass: process.env['GMAIL_PASSWORD']
    }
});

console.log("Trying to log into gmail with username winf2021.2022@gmail.com and password " + process.env['GMAIL_PASSWORD']);
templates.loadTemplate(__dirname + "/templates/server_status.html", "server_status").then((res) => {
    exports.sendStatusEmail('jak.tinhofer@billrothgymnasium.at',
        'Server Online',
        'Hi there! The WINF server is now online and ready! Development mode: ' + (process.env['DEV_MODE']),
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
    return await transporter.sendMail(mailOptions);
}

