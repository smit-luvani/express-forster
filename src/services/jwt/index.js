/**
 * @author Smit Luvani
 * @description Create Bearer Token for Object
 * @module https://www.npmjs.com/package/jsonwebtoken
 */

const jwt = require('jsonwebtoken'),
    logger = require('../winston')

/**
 * 
 * @param {jwt.JwtPayload} object 
 * @param {jwt.SignOptions} options
 * @returns 
 */
module.exports.sign = (object, options) => {
    if (process.env.JWT_SECRET == undefined) {
        throw new Error('JWT_SECRET is not found in environment variables. This application is using this service.')
    }

    try {
        const token = jwt.sign(object, process.env.JWT_SECRET, options);

        logger.info('Service [JWT]: Token Generated');

        return token;
    } catch (error) {
        logger.error('Service [JWT]: ' + error)
        return false;
    }
}

/**
 * 
 * @param {string} token 
 * @returns {jwt.VerifyCallback | boolean}
 */
module.exports.verify = (token) => {
    if (process.env.JWT_SECRET == undefined) {
        throw new Error('JWT_SECRET is not found in environment variables. This application is using this service.')
    }

    try {
        logger.info((token, jwt.verify(token, process.env.JWT_SECRET)) ? '[JWT]: Token Verified' : '[JWT]: Token Verification Failed')
        return token ? jwt.verify(token, process.env.JWT_SECRET) : false;
    } catch (error) {
        logger.error('Service [JWT]: ' + error)
        return false;
    }
}

/**
 * 
 * @param {string} token 
 * @param {jwt.DecodeOptions} options
 * @returns {jwt.JwtPayload}
 */
module.exports.decode = (token, options) => {
    try {
        return token ? jwt.decode(token, options) : false;
    } catch (error) {
        logger.error('Service [JWT]: ' + error)
        return false;
    }
}