"use strict";
/**
 * @author Smit Luvani
 * @description Set AWS Configuration 
 * @module https://www.npmjs.com/package/aws-sdk
 */

const AWS = require('aws-sdk');
const logger = require('../winston');
const { awsSDK: awsSDKConfig } = require('../../config/default.json')
const { awsSDK: awsSecrets } = require('../../config/secrets.json')

AWS.config.update({
    region: awsSDKConfig.region,
    accessKeyId: awsSecrets.accessKeyId,
    secretAccessKey: awsSecrets.secretAccessKey,
})

AWS.config.getCredentials(function(err) {
    err ? logger.error('Service [AWS-SDK]: ' + err.stack) : null;
});


module.exports = AWS;