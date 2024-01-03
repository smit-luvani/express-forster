/**
 * @author Smit Luvani
 * @description Parse Body of Stripe Buffer to JSON, String or Raw
 */
const logger = require('../../winston');

module.exports = (bodyBuffer) => {
    logger.silly('Helpers > Stripe Body Parser')

    const rawBody = new Buffer.from(new Buffer.from(bodyBuffer).toJSON().data).toString()

    return {
        toJSON: () => JSON.parse(rawBody),
        toString: () => rawBody
    }
}