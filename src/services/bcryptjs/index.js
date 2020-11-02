/**
 * @author Smit Luvani
 */

const bcryptjs = require('bcryptjs'),
    logger = require('../winston'),
    { logging, bcryptjs: option } = require('../../config/default.json')

module.exports.hash = async(string) => new Promise(async(resolve, reject) => {

    (logging.bcryptjs && option.salt > 10) ? (logger.warn('Recommend to salt less than 10 to make hash faster'), logger.info('Service [bcryptjs]: Creating Hash')) : null;

    return bcryptjs.genSalt(option.salt, function(error, salt) {
        (string && !error) ? bcryptjs.hash(string, salt, function(error, hash) {
            hash ? (logging.bcryptjs ? logger.info('Service [bcryptjs]: Hash: ' + hash) : null, resolve(hash)) : (logger.error('Service [bcryptjs]: ' + error), reject(error));
        }): (logger.info('Service [bcryptjs]: String is required to create hash'), reject(error));
    });
})

module.exports.compare = async(string, hash) => new Promise(async(resolve, reject) => {
    logging.bcryptjs ? logger.info('Service [bcryptjs]: Comparing Hash') : null;
    return (string && hash && await bcryptjs.compare(string, hash)) ? (logging.bcryptjs ? logger.info('Service [bcryptjs]: Hash matched ' + true) : null, resolve(true)) : (logging.bcryptjs ? logger.info('Service [bcryptjs]: Hash not matched') : null, reject(false));
})