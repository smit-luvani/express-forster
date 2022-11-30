/**
 * @author Smit Luvani
 * @description Distribute All Service to Application
 * - [RECOMMEND] Use Particular Service instead of all service or remove unwanted service
 */

module.exports = {
    winston: require('./winston'),
    mongoose: require('./mongoose'),
    firebaseAdmin: require('./firebase-admin'),
    jwt: require('./jwt'),
    bcryptjs: require('./bcryptjs'),
    razorpay: require('./razorpay'),
    aws: require('./aws-sdk'),
    multerS3: require('./multer-s3'),
    multer: require('./multer'),
    nodemailer: require('./nodemailer'),
};

// To Disable, Use Single Line Comment

// Service Log
// Enable/Disable Service Logging in config/default.json file