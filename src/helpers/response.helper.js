/**
 * @author Smit Luvani
 * @description This Function creates uniform response for application
 */

const logger = require("../services/winston"),
    httpStatus = require('http-status'),
    { isInteger } = require('lodash')
const { IncomingMessage } = require('http')
const hideSensitiveValue = require("../utils/hide-sensitive-value")
const JSONSort = require("../utils/json-sort");
const sortOption = { data: true, metadata: false }

/**
 * @description This function is used to create uniform response for application
 * @param {Express.Response} res It must be express response object
 * @param {number} status status code
 * @param {string} message message to be sent in response
 * @param {string | object | [] | Error} data 
 * @param {string} customCode any custom code for response
 * @param {string | object | number} metadata additional information
 * @returns {void} Directly sends response to client
 */
module.exports = (res, status, message, data, customCode, metadata) => {

    try {
        if (!res) {
            return logger.error('Response is required to send response')
        }

        if (!status || !isInteger(status) || httpStatus[status] === undefined) {
            return logger.error('Valid Status Code is required. Please check http-status package for valid status codes.')
        }

        if (data instanceof Error) {
            logger.error(data.stack);
        }

        // Calculate Response Time from Request Time
        let responseTime = (Date.now() - IncomingMessage.prototype.requestTime) / 1000

        var jsonResponse = {
            status,
            response: httpStatus[`${status}_NAME`],
            message,
            data: data && data instanceof Error == false ? (sortOption.data ? JSONSort(data) : data) : undefined,
            customCode,
            metadata: (metadata && typeof metadata == 'object' && sortOption.metadata) ? JSONSort(metadata) : metadata,
            error: data instanceof Error == true ? data?.stack : undefined,
        }

        if (status == httpStatus.INTERNAL_SERVER_ERROR) logger.silent = false

        const dataLog = (status < 200 || status > 299) ? (jsonResponse.data ? '\nData:' + JSON.stringify(hideSensitiveValue(jsonResponse.data)) : '') : 'Data: SUCCESS-RESPONSE-HIDDEN'
        const developerLog = jsonResponse.error ? `\nError: ${jsonResponse.error}` : ''

        // Logging the response
        logger.info(`===================== RESPONSE ===============================
Process Time: ${responseTime}s | Status: ${jsonResponse.status} | Response: ${jsonResponse.response} | Message: ${jsonResponse.message} ${jsonResponse.customCode ? '| Custom Code: ' + jsonResponse.customCode : ''} ${dataLog} ${developerLog}
==============================================================`)

        // Set Header
        res.setHeader('X-Request-ID', IncomingMessage.prototype?.requestId)

        // Send Response
        return res.status(parseInt(status)).json(jsonResponse)
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.stack })
    }
}