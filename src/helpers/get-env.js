/**
 * @author Smit Luvani
 * @description It will return the value of the environment variable based on environment variable name
 */

const logger = require('../services/winston')

module.exports = (env_name) => {
    if (process.env[env_name]) {
        logger.verbose(`Service [ENV]: Requested Environment Variable ${env_name} Found`)
        return process.env[env_name]
    }

    if (process.env[env_name + '_' + process.env.NODE_ENV]) {
        logger.verbose(`Service [ENV]: Requested Environment Variable ${env_name + '_' + process.env.NODE_ENV} Found`)
        return process.env[env_name + '_' + process.env.NODE_ENV]
    }

    logger.debug(`Service [ENV]: Environment Variable ${env_name} or ${env_name + '_' + process.env.NODE_ENV} Not Found`)
    return null;
}