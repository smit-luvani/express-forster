/**
 * @author Smit Luvani
 * @description Distribute All Service to Application
 * - Remove comment from below line to use service
 * - Enable/Disable Service wise Logging in config/default.js file
 */

module.exports.logger = require('./winston')
// module.exports.multerS3 = require('./multer-s3') // Remove comment when enabling file-upload route
// module.exports.multer = require('./multer')
// module.exports.mongoose = require('./mongoose')
// module.exports.firebaseAdmin = require('./firebase-admin')
// module.exports.jwt = require('./jwt')
// module.exports.bcryptjs = require('./bcryptjs')
// module.exports.razorpay = require('./razorpay')
// module.exports.aws = require('./aws-sdk')
// module.exports.nodemailer = require('./nodemailer')
// module.exports.nodemailerSendGrid = require('./nodemailer/sendgrid')
// module.exports.stripe = require('./stripe')
// module.exports.redis = require('./redis')
module.exports.DayJS = require('./dayjs')