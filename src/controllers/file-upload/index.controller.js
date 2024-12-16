/**
 * @author Smit Luvani
 * @description Upload File to S3
 */
const httpStatus = require('http-status'),
    { multerS3 } = require('../../services'),
    multer = require('multer'),
    defaultOption = require('../../config/default');
const { responseHelper } = require('../../helpers');
const { getLoggerInstance } = require('../../utils');
const LoggerPrefix = 'Controller > File Upload > Controllers';

module.exports = async function (req, res) {
    const logger = getLoggerInstance(...arguments);
    logger.info(LoggerPrefix, 'File Upload');

    try {
        multerS3.array('files')(req, res, async error => {
            if (error instanceof multer.MulterError) {
                logger.error(error.message)
                return responseHelper(res, httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Image Upload Failed', error)
            } else if (error) {
                logger.error(error.message)
                return responseHelper(res, httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Image Upload Failed', error)
            }

            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                let fileURLs = req.files.map(data => data.key)

                logger.info('Total File Uploaded: ' + fileURLs.length);
                return responseHelper(res, httpStatus.OK, 'File Uploaded', { files_url: fileURLs })
            } else {
                return responseHelper(res, httpStatus.FORBIDDEN, 'Invalid File', { valid_file: defaultOption.multer.validMimeType, maxSize: '20 MB' });
            }
        })
    } catch (error) {
        return responseHelper(res, httpStatus.INTERNAL_SERVER_ERROR, error.message || 'internalError', error)
    }
}