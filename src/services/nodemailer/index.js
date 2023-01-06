const nodemailer = require('nodemailer'),
    logger = require('../winston')

if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    throw new Error('Service [NODEMAILER]: SMTP Configuration Missing in environment variables')
}

let transporter = nodemailer.createTransport({
    service: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    debug: true,
    logger: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
    pool: true
});

/**
 * @author Smit Luvani
 * @description SMTP Mailer
 * @module https://www.npmjs.com/package/nodemailer
 * @tutorial https://nodemailer.com/about/
 * @example https://github.com/nodemailer/nodemailer/tree/master/examples
 * 
 * @param {{
 * fromMail: String,
 * toMail: String,
 * subject: String,
 * body: String,
 * senderName: String,
 * attachments: Array
 * }} options
 */
module.exports = async (options) => {
    let {
        fromMail = 'Express Forster',
        toMail,
        subject,
        body,
        senderName,
        attachments = []
    } = options;

    if (!toMail || !subject || !body) {
        return logger.error('Service [NODEMAILER]: Missing Required Parameter')
    }

    try {
        let info = await transporter.sendMail({
            from: `${senderName || fromMail}`, // sender address
            to: toMail, // list of receivers
            subject: subject, // Subject line
            html: body, // html body
            attachments: attachments // attachments
        });

        logging.nodemailer ? logger.info(`Service [NODEMAILER]: Mail Sent Result => ${JSON.stringify(info)}`) : null;
        return info;
    } catch (error) {
        return logger.error('Service [NODEMAILER]: ', error)
    }
}