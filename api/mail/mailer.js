var nm = require('nodemailer');

transporter = nm.createTransport({
    service: 'gmail',
    auth: {
        user: 'winf2021.2022@gmail.com',
        pass: process.env['GMAIL_PASSWORD']
    }
});

console.log("Trying to log into gmail with username winf2021.2022@gmail.com and password " + process.env['GMAIL_PASSWORD']);


exports.sendTestEmail = async (rec) => {
    var mailOptions = {
        from: 'WINF 2021 / 2022',
        to: rec,
        subject: 'Server online',
        text: 'The WINF server has been started.'
    }
    return await transporter.sendMail(mailOptions);
}

module.exports.sendTestEmail('jak.tinhofer@billrothgymnasium.at');