/**
 * @author Smit Luvani
 * @description Hash String using bcrypt JS
 * @module https://www.npmjs.com/package/bcryptjs
 */

const bcryptjs = require('bcryptjs');
const { getLoggerInstance } = require('../../utils/index.js');
const Config = {
    salt: 6
}

module.exports.hash = async function (string) {
    const logger = getLoggerInstance(...arguments);

    return new Promise(async (resolve, reject) => {
        return bcryptjs.genSalt(Config.salt, function (error, salt) {
            if (error) {
                logger.error('Service [bcryptjs]: Error generating salt', error);
                return reject(error);
            }

            if (!string) {
                logger.error('Service [bcryptjs]: String is required to create hash');
                return reject(new Error('String is required to create hash'));
            }

            bcryptjs.hash(string, salt, function (error, hash) {
                if (error) {
                    logger.error('Service [bcryptjs]: Error generating hash', error);
                    return reject(error);
                }

                logger.verbose('Service [bcryptjs]: Hash generated.');
                resolve(hash);
            });
        });
    });
}

module.exports.compare = async function (string, hash) {
    const logger = getLoggerInstance(...arguments);

    if (!string || !hash) {
        logger.error('Service [bcryptjs]: String and hash are required for comparison');
        throw new Error('String and hash are required for comparison');
    }

    try {
        const isMatch = await bcryptjs.compare(string, hash);
        if (isMatch) {
            logger.verbose('Service [bcryptjs]: Hash matched');
            return true;
        } else {
            logger.verbose('Service [bcryptjs]: Hash not matched');
            return false;
        }
    } catch (error) {
        logger.error('Service [bcryptjs]: Error comparing hash', error);
        throw error;
    }
};