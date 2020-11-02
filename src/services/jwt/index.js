/**
 * @author Smit Luvani
 */

const jwt = require('jsonwebtoken'),
    { jwt: secrets } = require('../../config/secrets.json'),
    logger = require('../winston'),
    { logging } = require('../../config/default.json')

module.exports.sign = (object) => {
    try {
        const token = object ? jwt.sign(object, secrets[process.env.NODE_ENV]) : undefined;

        if (!token) {
            logger.error('Service [JWT]: String/Object Required to create Sign Token')
            return false
        }

        logging.jwt ? logger.info('Service [JWT]: Token: ' + token) : null;

        return token;
    } catch (error) {
        logger.error('Service [JWT]: ' + error);
        return null
    }
}

module.exports.verify = (token) => {
    try {
        return token ? jwt.verify(token, secrets[process.env.NODE_ENV]) : false;
    } catch (error) {
        logger.error('Service [JWT]: ' + error)
        return false;
    }
}