/**
 * @author Smit Luvani
 * @description Multer will upload file object to System Bucket
 * @module https://www.npmjs.com/package/multer
 */
const multer = require('multer'),
    { multer: multerConfig } = require('../../config/default.js'),
    { v4: uuidv4 } = require('uuid')

// Local Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destinationPath = process.cwd()
        cb(null, destinationPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + uuidv4() + file.mimetype.split('/')[1])
    }
})

// File Filter based on mimetype
const fileFilter = (req, file, cb) => {

    /**
     * @modify Set Valid Mime Type from Default JSON
     */

    if (!multerConfig.validMimeType.includes(file.mimetype)) {
        return cb(null, false, new Error('Invalid File Type'))
    }
    return cb(null, true)
}

// Multer
module.exports = multer({
    storage: storage,
    fileFilter
})