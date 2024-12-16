/**
 * @author Smit Luvani
 * @description Export utils
 */

const AxiosHelper = require('../helpers/axios.helpers');

module.exports.randomGenerateUtil = require('./random')
module.exports.regexValidateUtil = require('./regex')
module.exports.timeUtil = require('./time-validation')
module.exports.replaceAll = require('./replaceAll')
module.exports.hideSensitiveValue = require('./hide-sensitive-value')
module.exports.sortObject = require('./sort-json-alphabetically') // This function bind JSON object prototype to sort JSON alphabetically
module.exports.versionParser = require('./version-parser')
module.exports.getLoggerInstance = require('./find-parent-logger')

/**
 * 
 * @param {string} email 
 */
module.exports.checkDisposableEmail = (email) => new Promise((resolve, reject) => {
    AxiosHelper.APIGet('https://open.kickbox.com/v1/disposable/' + email).then((response) => resolve(response.data?.disposable)).catch(reject)
})