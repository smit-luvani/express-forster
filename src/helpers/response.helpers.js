/**
 * @author Smit Luvani
 * @description This Function creates uniform response for application
 */

const { isInteger } = require('lodash');
const JSONSort = require('../utils/sort-json-alphabetically');
const ErrorStackParser = require('error-stack-parser');
const getLoggerInstance = require('../utils/find-parent-logger');
const { ValidationError } = require('joi');
const { httpStatus, DayJS } = require('../services');
const { CURRENT_ENVIRONMENT, environments } = require('../common');

/**
 * @description This function is used to create uniform response for application
 * @param {Express.Response} res It must be express response object
 * @param {number | Error | ValidationError} status status code.
 * You can pass full object from PromiseResponseHelper function. It will automatically extract status code from it.
 * if you pass object then you can skip message, data, customCode, metadata parameters
 * @param {string} message message to be sent in response
 * @param {string | object | [] | Error | ValidationError} data
 * @param {string} customCode any custom code for response
 * @param {string | object | number} metadata additional information
 * @param {object} options additional options
 * @param {boolean} options.sort sort data alphabetically
 * @param {boolean} options.terminateAttachedLogger terminate attached
 * @returns {void} Directly sends response to client
 */
module.exports = function (
    res,
    status,
    message,
    data,
    customCode,
    metadata,
    options = {
        sort: true,
        terminateAttachedLogger: true,
    }
) {
    let childLogger = getLoggerInstance(...arguments)
    try {
        if (!res) {
            throw new Error('Response is required to send response');
        }

        if (options.sort === undefined) options.sort = true;
        if (options.terminateAttachedLogger === undefined) options.terminateAttachedLogger = true;


        if ((status instanceof Error && status instanceof ValidationError) || data?.isJoi) {
            let _errorObject = status instanceof Error ? status : data;
            status = httpStatus.BAD_REQUEST;
            message = _errorObject.message;

            if (_errorObject instanceof Error) {
                if (_errorObject instanceof ValidationError) {
                    data = _errorObject.details;
                } else {
                    data = _errorObject;
                }
            } else {
                data = _errorObject;
            }
        } else if ((status && typeof status === 'object') || status instanceof Error) {
            let statusObject = status;
            status = statusObject.status;
            message = statusObject.message;
            customCode = statusObject.customCode;
            metadata = statusObject.metadata;

            if (statusObject && typeof statusObject != 'object') {
                data = { statusObject };
            }

            if (statusObject instanceof Error) {
                data = statusObject;
            } else {
                data = statusObject.data;
            }

            if (statusObject?.isMongoError) {
                data = statusObject.error;
                status = statusObject.httpStatus;
            }
        } else {
            if (data && typeof data != 'object') {
                data = { data };
            }
        }

        if (!status) {
            status = httpStatus.INTERNAL_SERVER_ERROR;
        }

        if (!status || !isInteger(status) || httpStatus[status] === undefined) {
            throw new Error('[response]: Valid Status Code is required. Please check http-status package for valid status codes.');
        }

        if (!message) {
            if (data instanceof Error) message = data.message;
        }

        if (data instanceof Error) {
            childLogger.error(data.stack);
        }
    } catch (error) {
        childLogger.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: httpStatus.INTERNAL_SERVER_ERROR, error: error.stack });
    }

    // Calculate Response Time from Request Time
    let responseTime = DayJS().diff(res.requestTime, 'millisecond');

    let errorInstance;
    if (data instanceof Error) {
        errorInstance = data;
        data = undefined;
    }

    try {
        var jsonResponse = {
            status,
            response: httpStatus[`${status}_NAME`],
            message,
            data: data,
            customCode,
            metadata,
            _developer: (() => {
                if (CURRENT_ENVIRONMENT === environments.production) return undefined;

                if (errorInstance?.isJoi) {
                    return errorInstance?.details;
                } else if (errorInstance instanceof Error) {
                    return ErrorStackParser.parse(errorInstance).reverse();
                }

                return undefined;
            })(),
        };

        if (options.sort && jsonResponse.data) {
            try {
                jsonResponse.data = JSONSort(jsonResponse.data);
            } catch {
                // Do nothing
            }
        }
        if (CURRENT_ENVIRONMENT !== environments.production) jsonResponse.error = data instanceof Error == true ? data?.stack : undefined;
    } catch (error) {
        childLogger.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.stack });
    }

    try {
        if (status == httpStatus.INTERNAL_SERVER_ERROR) childLogger.silent = false;

        const dataLog = status < 200 || status > 299 ? (jsonResponse.data ? '\nData:' + JSON.stringify(hideSensitiveValue(jsonResponse.data)) : '') : 'Data: SUCCESS-RESPONSE-HIDDEN';
        const developerLog = jsonResponse.error ? `\nError: ${jsonResponse.error}` : '';

        // Logging the response
        const logString = `RESPONSE
Process Time: ${responseTime}ms | Status: ${jsonResponse.status} | Response: ${jsonResponse.response} | Message: ${jsonResponse.message} ${jsonResponse.customCode ? '| Custom Code: ' + jsonResponse.customCode : '|'} ${dataLog} ${developerLog}
==============================================================`;

        if (status >= 500) {
            childLogger.error(logString);
        } else {
            childLogger.info(logString);
        }

        // Set Header
        res.setHeader('X-Request-ID', res?.requestId);
        res.setHeader('X-Response-Time', responseTime + 'ms');

        // Send Response
        return res.status(parseInt(status)).json(jsonResponse);
    } catch (error) {
        childLogger.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || 'Something went wrong', error: error.stack });
    } finally {
        if (res.logger && options.terminateAttachedLogger === true) {
            childLogger.close();
            childLogger.destroy();
            childLogger = null;
        }
    }
};
