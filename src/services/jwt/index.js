/**
 * @author Smit Luvani
 * @description Create Bearer Token for Object
 * @module https://www.npmjs.com/package/jsonwebtoken
 */

const jwt = require('jsonwebtoken'),
    logger = require('../winston')
const packageInfo = require('../../../package.json')
/**
 * 
 * @param {jwt.JwtPayload} object 
 * @param {jwt.SignOptions} options
 * @returns 
 */
module.exports.sign = (object, options = {}) => {
    options.issuer = options?.issuer || packageInfo.name;
    options.audience = options?.audience || packageInfo.name;

    try {
        const token = object ? jwt.sign(object, process.env.JWT_SECRET, options) : undefined;

        if (!token) {
            logger.error('Service [JWT]: String/Object Required to create Sign Token')
            return false
        }

        logger.debug('Service [JWT]: Token Generated');

        return token;
    } catch (error) {
        logger.error('Service [JWT]: ' + error)
        throw error
    }
}
/**
 * 
 * @param {string} token 
 * @param {jwt.VerifyOptions} verifyOption
 * @returns {jwt.JwtPayload | false}
 */
module.exports.verify = (token, verifyOption) => {
    try {
        if (token) {
            var verifyToken = jwt.verify(token, process.env.JWT_SECRET)
            logger.debug('Service [JWT]: Token Verified')
            return verifyToken
        }

        throw new Error('Token Required to Verify')
    } catch (error) {
        logger.verbose('Service [JWT]: Token could not verify. ' + error)
        return false;
    }
}

module.exports.decode = (token) => {
    try {
        return token ? jwt.decode(token) : false;
    } catch (error) {
        logger.error('Service [JWT]: ' + error)
        return false;
    }
}