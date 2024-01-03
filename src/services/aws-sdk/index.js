/**
 * @author Smit Luvani
 * @description Export AWS SDK configured modules
 */

const AWS_S3 = require('@aws-sdk/client-s3');
const { awsSDK: awsSDKConfig } = require('../../config/default');

/**
 * @module https://www.npmjs.com/package/@aws-sdk/client-s3
 * @returns {AWS_S3.S3Client} S3Client
*/
module.exports.S3Client = new AWS_S3.S3Client({
    region: awsSDKConfig.region,
});