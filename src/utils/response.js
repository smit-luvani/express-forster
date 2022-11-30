/**
 * @author Smit Luvani
 * @description This Function creates uniform response for application
 */

require("express").response;
const logger = require("../services/winston"),
    httpStatus = require('http-status'),
    { isInteger } = require('lodash')

/**
 * @description This function is used to create uniform response for application
 * @param {Express.Response} res It must be express response object
 * @param {number} status status code
 * @param {string} message message to be sent in response
 * @param {string | object | [] | Error} data 
 * @param {string} customCode any custom code for response
 * @param {string} metadata additional information
 * @returns 
 */
module.exports = (res, status, message, data, customCode, metadata) => {

    if (!res) {
        return logger.error('Response is required to send response')
    }

    if (!status || !isInteger(status)) {
        return logger.error('Valid Status Code is required')
    }

    if (data instanceof Error) { data = undefined }

    // Calculate Response Time from Request Time
    let requestTime = res._requestTime
    let responseTime = (Date.now() - requestTime) / 1000

    let jsonResponse = {
        status,
        response: httpStatus[`${status}_NAME`],
        error: (status < 200 && status > 299) ? httpStatus[`${status}_MESSAGE`] : undefined,
        message,
        data,
        customCode,
        metadata,
        _developer: data instanceof Error ? data.stack : undefined,
    }

    if (status == httpStatus.INTERNAL_SERVER_ERROR) logger.silent = false

    // Logging the response
    logger.info(`
------------------- RESPONSE -------------------
Request ID: ${res._requestID} | Time: ${responseTime} s | Status: ${jsonResponse.status} | Response: ${jsonResponse.response} ${jsonResponse.customCode ? '| Custom Code: ' + jsonResponse.customCode : ''}
Message: ${jsonResponse.message}
Data: ${(status < 200 || status > 299) ? JSON.stringify(jsonResponse.data) || null : 'SUCCESS-RESPONSE-HIDDEN'}
------------------------------------------------`)

    // Set Header
    res.setHeader('request-ID', res._requestID)

    // Send Response
    return res.status(parseInt(status)).json(jsonResponse)
}