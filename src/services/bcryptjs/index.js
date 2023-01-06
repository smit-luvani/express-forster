/**
 * @author Smit Luvani
 * @description Hash String using bcrypt JS
 * @module https://www.npmjs.com/package/bcryptjs
 */

const bcryptjs = require('bcryptjs'),
    logger = require('../winston'),
    { bcryptjs: option } = require('../../config/default.js')

module.exports.hash = async (string) => new Promise(async (resolve, reject) => {

    return bcryptjs.genSalt(option.salt, function (error, salt) {
        (string && !error) ? bcryptjs.hash(string, salt, function (error, hash) {
            hash ? (logger.info('Service [bcryptjs]: Hash generated.'), resolve(hash)) : (logger.error('Service [bcryptjs]: ' + error), reject(error));
        }) : (logger.error('Service [bcryptjs]: String is required to create hash'), reject(error));
    });
})

module.exports.compare = async (string, hash) => new Promise(async (resolve, reject) => {
    return (string && hash && await bcryptjs.compare(string, hash)) ? (logger.info('Service [bcryptjs]: Hash matched'), resolve(true)) : (logger.info('Service [bcryptjs]: Hash not matched'), reject(false));
})