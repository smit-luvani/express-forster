
const logger = require('../../winston')
const { isNumber } = require('lodash')

/**
 * @author Smit Luvani
 * @description Converts a currency amount to its minor unit equivalent for use with Stripe API requests. For example, $59.09 will be 5909. Stripe only accept minor unit.
 * @param {number} amount - The currency amount to convert.
 * @returns {number} - The minor unit equivalent of the provided currency amount. Integer Value. Return 0 if any invalid input.
 * @throws {Error} - Throws an error if the provided amount is not a number.
*/
module.exports = (amount) => {
    logger.silly('Service [Stripe > Helpers]: Convert Currency to Minor Unit')

    if (!amount) {
        logger.error('Service [Stripe > Helpers]: Amount is missing')
        return 0;
    }

    amount = Number(amount)

    if (!isNumber(amount)) {
        logger.error('Service [Stripe > Helpers]: Amount is not a number')
        return 0;
    }

    return parseInt(amount * 100) || 0;
}