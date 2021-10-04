/**
 * @author Smit Luvani
 * @description This Function creates uniform response for application
 */

const logger = require("../services/winston"),
    httpStatus = require('http-status'),
    { isInteger } = require('lodash')

module.exports = (res, status, message, data, customCode) => {
    // res = response object

    if (!res) {
        return logger.error('Response Object is require to send response')
    }

    if (!status || !isInteger(status)) {
        return logger.error('Valid Status Code is required')
    }

    // Calculate Response Time from Request Time
    let requestTime = res._requestTime
    let responseTime = (Date.now() - requestTime) / 1000

    let jsonResponse = {
        status,
        response: httpStatus[`${status}_NAME`],
        error: (status < 200 && status > 299) ? httpStatus[`${status}_MESSAGE`] : undefined,
        message,
        data,
        customCode
    }

    // Logging the response
    logger.debug(`Response:
    Request ID: ${res._requestID} | Time: ${responseTime} s | Status: ${jsonResponse.status} | Response: ${jsonResponse.response}
    Message: ${jsonResponse.message}
    Data: ${(status < 200 || status > 299) ? jsonResponse.data || null : 'SUCCESS-RESPONSE-SHOULD-BE-HIDDEN'}`)

    // Set Header
    res.setHeader('request-ID', res._requestID)

    // Send Response
    return res.status(parseInt(status)).json(jsonResponse)
}