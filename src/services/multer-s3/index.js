"use strict";
/**
 * @author Smit Luvani
 * @description Multer S3 will upload file object to AWS S3 Bucket
 * @module https://www.npmjs.com/package/multer-s3
 * @module https://www.npmjs.com/package/multer
 */

const AWS = require('../aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    { awsSDK: awsSDKConfig, multer: multerConfig, logging } = require('../../config/default.json'),
    logger = require('../winston'),
    { v4: uuidv4 } = require('uuid')

// AWS Configuration
const s3 = new AWS.S3()

// S3 Storage
const storageS3 = multerS3({
    s3: s3,
    bucket: awsSDKConfig.bucketName,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: awsSDKConfig.acl,
    metadata: (req, file, cb) => {
        // Metadata callback returns field name of file
        cb(null, { filename: file.fieldname })
    },
    key: (req, file, cb) => {

        // Directory & File Name
        let directory = awsSDKConfig.directory.files;
        let file_name = `FILE-${uuidv4()}.${file.mimetype.split('/')[1]}`;

        logging.multerS3 ? logger.debug(`File: ${awsSDKConfig.directory.files}/FILE-${uuidv4()}.${file.mimetype.split('/')[1]}`) : null;

        // Callback Returns Path + Filename
        cb(null, `${directory}/${file_name}`);
    }
})

// File Filter based on mimetype
const fileFilter = (req, file, cb) => {

    // Set Valid Mime Type from Default JSON
    if (!multerConfig.validMimeType.includes(file.mimetype)) {
        cb(null, false, new Error('Invalid File Type'))
    }
    cb(null, true)
}

// Multer
module.exports = multer({
    storage: storageS3,
    fileFilter
})