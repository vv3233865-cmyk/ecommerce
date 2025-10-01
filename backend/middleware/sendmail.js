const nodemailer = require('nodemailer')

const sendmail = async (email, subject, text) => {

    // config
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GPASS,
        }
    })

    // send mail

    try {
        await transport.sendMail({
            from: process.env.GMAIL,
            to: email,
            subject,
            text,
        });
        console.log("Email sent");
    } catch (error) {
        console.error("Error sending email:", error);
    }

}

module.exports = sendmail

