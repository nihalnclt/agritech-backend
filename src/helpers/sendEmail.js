const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: `Agritech - ${subject}`,
            text: text,
        });
    } catch (error) {
        console.log('E-mail not sent');
    }
};

module.exports = sendEmail;
