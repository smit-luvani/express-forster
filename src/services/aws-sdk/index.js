/**
 * @author Smit Luvani
 * @description Set AWS Configuration
 * @module https://www.npmjs.com/package/aws-sdk
 */

const AWS = require('aws-sdk'),
    logger = require('../winston'),
    { awsSDK: awsSDKConfig } = require('../../config/default.js')

AWS.config.update({
    region: awsSDKConfig.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

AWS.config.getCredentials(function (err) {
    err ? logger.error('Service [AWS-SDK]: ' + err.stack) : null;
});

module.exports = AWS;