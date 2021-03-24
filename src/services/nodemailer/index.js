/**
 * @author Smit Luvani
 * @description SMTP Mailer
 * @module https://www.npmjs.com/package/nodemailer
 * @tutorial https://nodemailer.com/about/
 * @example https://github.com/nodemailer/nodemailer/tree/master/examples
 */

const nodemailer = require('nodemailer'),
    { nodemailer: nodemailerSecret } = require('../../config/secrets.json'),
    { logging } = require('../../config/default.json'),
    logger = require('../winston')

// Check Secret
if (!nodemailerSecret[process.env.NODE_ENV] || !nodemailerSecret[process.env.NODE_ENV].smtp || !nodemailerSecret[process.env.NODE_ENV].email || !nodemailerSecret[process.env.NODE_ENV].password) {
    return logger.error('Service [NODEMAILER]: SMTP or Email or Password not found for current environment')
}

module.exports = async(fromMail, toMail, subject, body, senderName) => {
    if (!fromMail || !toMail || !subject || !body) {
        return logger.error('Service [NODEMAILER]: Missing Required Parameter')
    }

    try {
        let transporter = nodemailer.createTransport({
            service: nodemailerSecret[process.env.NODE_ENV].smtp || 'gmail',
            port: nodemailerSecret[process.env.NODE_ENV].port || 465,
            secure: true,
            auth: {
                user: nodemailerSecret[process.env.NODE_ENV].email,
                pass: nodemailerSecret[process.env.NODE_ENV].password,
            },
        });

        let info = await transporter.sendMail({
            from: `${senderName || fromMail}`, // sender address
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