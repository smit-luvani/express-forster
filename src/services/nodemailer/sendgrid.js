const nodemailer = require('nodemailer');
const nodemailerSendGrid = require('nodemailer-sendgrid');
const nodemailerService = require('./index')
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
 * @param {Function} cb
 */
module.exports = async (options, cb) => {
    return nodemailerService({ ...options, transporter }, cb);
}