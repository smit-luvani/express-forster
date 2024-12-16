/**
 * @author Smit Luvani
 * @description Distribute All Service to Application
 * - Remove comment from below line to use service
 * - Enable/Disable Service wise Logging in config/default.js file
 */

const Logger = require('./winston');
// const StripeService = require('./stripe');

module.exports.logger = Logger;
module.exports.DayJS = require('./dayjs')
module.exports.Joi = require('./Joi');
module.exports.httpStatus = require('http-status').default;
module.exports.multerS3 = require('./multer-s3') // Remove comment when enabling file-upload route
module.exports.multer = require('./multer')
module.exports.AWS_SDK = require('./aws-sdk')
// module.exports.mongoose = require('./mongoose')
// module.exports.firebaseAdmin = require('./firebase-admin')
// module.exports.jwt = require('./jwt')
// module.exports.bcryptjs = require('./bcryptjs')
// module.exports.RazorpayClient = require('./razorpay');
// module.exports.nodemailer = require('./nodemailer')
// module.exports.redis = require('./redis')
// module.exports.StripeTestingAccount = StripeService.Stripe(StripeService.StripeConstants.StripeAccount.testingAccount);