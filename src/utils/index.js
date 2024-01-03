/**
 * @author Smit Luvani
 * @description Export utils
 */

module.exports.arrayItemInArrayUtil = require('./array-item-in-array')
module.exports.randomGenerateUtil = require('./random')
module.exports.regexValidateUtil = require('./regex')
module.exports.timeUtil = require('./time-validation')
module.exports.replaceAll = require('./replaceAll')
module.exports.hideSensitiveValue = require('./hide-sensitive-value')
module.exports.sortObject = require('./sort-json-alphabetically') // This function bind JSON object prototype to sort JSON alphabetically

/**
 * 
 * @param {string} email 
 */
module.exports.checkDisposableEmail = (email) => new Promise((resolve, reject) => {
    require('unirest').get('https://open.kickbox.com/v1/disposable/' + email).end((response) => {
        if (response.error) {
            return reject(response.error)
        }

        return resolve(response.body)
    })
})