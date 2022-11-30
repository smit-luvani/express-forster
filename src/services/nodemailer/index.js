/**
 * @author Smit Luvani
 * @description SMTP Mailer
 * @module https://www.npmjs.com/package/nodemailer
 * @tutorial https://nodemailer.com/about/
 * @example https://github.com/nodemailer/nodemailer/tree/master/examples
 */

const nodemailer = require('nodemailer'),
    { logging } = require('../../config/default.json'),
    logger = require('../winston')

// Check Secret
if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    logger.error('Service [NODEMAILER]: SMTP or Email or Password not found for current environment')
    process.exit(1);
}

let transporter = nodemailer.createTransport({
    service: process.env.SMTP_HOST || 'gmail',
    port: process.env.SMTP_PORT || 465,
    secure: true,
    debug: true,
    logger: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

module.exports = async (fromMail, toMail, subject, body, senderName) => {
    if (!toMail || !subject || !body) {
        return logger.error('Service [NODEMAILER]: Missing Required Parameter')
    }

    try {
        let info = await transporter.sendMail({
            from: `${senderName || fromMail || 'Express Forster'}`, // sender address
            to: toMail, // list of receivers
            subject: subject, // Subject line
            html: body, // html body
        });

        logging.nodemailer ? logger.info(`Service [NODEMAILER]: Mail Sent Result => ${JSON.stringify(info)}`) : null;
        return info;
    } catch (error) {
        return logger.error('Service [NODEMAILER]: ', error)
    }
}