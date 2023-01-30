const nodemailer = require('nodemailer'),
    logger = require('../winston')

if (!process.env.SENDGRID_API_KEY) {
    throw new Error('Service [NODEMAILER-SendGrid]: SENDGRID_API_KEY Missing in environment variables')
}

const nodemailerSendGrid = require('nodemailer-sendgrid');
const transporter = nodemailer.createTransport(nodemailerSendGrid({ apiKey: process.env.SENDGRID_API_KEY }));

/**
 * @author Smit Luvani
 * @description Nodemailer transport for SendGrid
 * @module https://www.npmjs.com/package/nodemailer
 * @tutorial https://github.com/nodemailer/nodemailer-sendgrid
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
module.exports = async (options, cb) => {
    let {
        fromMail,
        toMail,
        subject,
        body,
        senderName,
        attachments = []
    } = options;

    if (!toMail || !subject || !body) {
        return logger.error('Service [NODEMAILER-SENDGRID]: Missing Required Parameter. fromMail, toMail, subject, body are required.')
    }

    try {
        let info = await transporter.sendMail({
            from: senderName ? senderName + ` <${fromMail}>` : fromMail, // sender address
            to: toMail, // list of receivers
            subject: subject, // Subject line
            html: body, // html body
            attachments: attachments, // attachments
            sender: senderName,
        });

        if (cb) cb(null, info)
        logger.silly('Service [NODEMAILER-SENDGRID]: Success')
        return true;
    } catch (error) {
        if (cb) throw cb(error)
        logger.error('Service [NODEMAILER-SENDGRID]: ', error)
        return false;
    }
}