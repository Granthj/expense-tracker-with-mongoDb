const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD_KEY,
    },
});

const mailOptions = async (email, subject, link) => {
    try {

        const info = await transporter.sendMail({
            from: {
                name: "Expense-App",
                address: process.env.SENDER_EMAIL
            }, // sender address
            to: email, // list of recipients
            subject: subject, // subject line
            text: `Click this link to reset your password: ${link}`,
            html: `<p>Click below to reset your password:</p>
       <a href="${link}">Reset Password</a>` // HTML body
        });
    }
    catch (err) {
        console.error('Email error:', err);
    }
}

module.exports = mailOptions;