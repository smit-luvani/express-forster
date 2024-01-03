const httpStatus = require("http-status");

/**
 * @author Smit Luvani
 * @description Format success or error object for response
 * @param {number} status HTTP Status Code
 * @param {string} message Message for response
 * @param {object} data Data for response
 * @param {string} customCode Custom Code for response
 * @param {object} metadata Metadata for response
 * @typedef {{status: number, message: string, data: object, customCode: string, metadata: object}} PromiseReturn
 * @returns {PromiseReturn}
 */
module.exports = (status, message, data, customCode, metadata) => {
    let returnObject = {}

    if (status instanceof Error) {
        returnObject.status = httpStatus.INTERNAL_SERVER_ERROR
        returnObject.message = status.message
        returnObject.data = status
        returnObject.customCode = status.code
        returnObject.metadata = status.metadata
        return returnObject
    }

    status ? returnObject.status = status : null;
    message ? returnObject.message = message : null;
    data ? returnObject.data = data : null;
    customCode ? returnObject.customCode = customCode : null;
    metadata ? returnObject.metadata = metadata : null;
    return returnObject;
}

/**
 * @callback PromiseReturnCallback
 * @param {PromiseReturn}
 */