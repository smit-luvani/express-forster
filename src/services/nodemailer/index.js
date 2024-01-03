/**
 * @author Smit Luvani
 * @description SMTP Mailer
 * @module https://www.npmjs.com/package/nodemailer
 * @tutorial https://nodemailer.com/about/
 * @example https://github.com/nodemailer/nodemailer/tree/master/examples
 */

const nodemailer = require('nodemailer'),
    logger = require('../winston')

let transporterDefault = nodemailer.createTransport({
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
 * @description Nodemailer transport for SendGrid
 * @module https://www.npmjs.com/package/nodemailer
 * 
 * @param {{
* fromMail: String,
* toMail: String,
* subject: String,
* body: String,
* senderName: String,
* attachments: Array,
* transporter: nodemailer.Transporter
* }} options
* @param {Function} cb
*/
module.exports = async (options, cb) => {
    let { fromMail, toMail, subject, body, senderName, attachments = [], transporter = transporterDefault } = options;

    if (!fromMail || !toMail || !subject || !body) {
        return logger.error('Service [NODEMAILER]: Missing Required Parameter. fromMail, toMail, subject, body are required.')
    }

    try {
        let info = await transporter.sendMail({
            from: senderName ? senderName + ` <${fromMail}>` : fromMail, // sender address
            to: toMail, // list of receivers
            subject: subject, // Subject line
            html: body, // html body
            attachments: attachments, // attachments
            sender: senderName ? senderName + ` <${fromMail}>` : fromMail,
        });

        logger.verbose(`Service [NODEMAILER]: Mail Sent`);
        return info;
    } catch (error) {
        return logger.error('Service [NODEMAILER]: ', error)
    }
}