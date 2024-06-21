/**
 * @author Smit Luvani
 * @description Winston is use to log in development environment
 * Log levels
 *  - error: 0
 *  - warn: 1
 *  - info: 2
 *  - http: 3
 *  - verbose: 4
 *  - debug: 5
 *  - silly: 6
 * @module https://www.npmjs.com/package/winston
 * @tutorial https://github.com/winstonjs/winston
 */

/**
 * @typedef {import('winston').Logger} TypeWinstonLogger
 */

const winston = require('winston');
const util = require('util')
const hideSensitiveValue = require('../../utils/hide-sensitive-value');

var logLevel;
if (process.env.LOG_LEVEL) {
    logLevel = process.env.LOG_LEVEL
} else {
    switch (process.env.NODE_ENV) {
        case 'development':
            logLevel = 'silly'
            break;
        case 'beta':
            logLevel = 'debug'
            break;
        default:
            logLevel = 'warn'
            break;
    }
}

const { combine, timestamp, printf, json, errors, colorize, metadata } = winston.format;

const logFormat = combine(
    errors({ stack: true }),
    json(),
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
    printf(({ level, message, timestamp, requestId }) => {
        const ReqId = requestId ? `[${requestId}]` : '';
        if (typeof message === 'object') message = JSON.stringify(hideSensitiveValue(message))

        return `[${timestamp}][${level}]${ReqId}: ${String(message)}`;
    }))

const fileLogFormat = combine(
    errors({ stack: true }),
    json(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
    printf(({ level, message, timestamp, requestId }) => {
        const ReqId = requestId ? `[${requestId}]` : '';
        if (typeof message === 'object') message = JSON.stringify(hideSensitiveValue(message))

        return `[${timestamp}][${level}]${ReqId}: ${String(message)}`;
    }))

const today = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`

/** @type {import('winston').LoggerOptions} */
const option = (level = logLevel) => ({
    transports: [
        new winston.transports.Console({
            level: level,
            format: logFormat
        }),
        new winston.transports.File({
            level: level,
            format: fileLogFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV || 'no-environment'}/stdout-${today}.log`,
        }),
        new winston.transports.File({
            level: 'error',
            format: fileLogFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV || 'no-environment'}/error-${today}.log`,
        })
    ],

    handleExceptions: true,
    exceptionHandlers: [
        new winston.transports.File({
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV || 'no-environment'}/exceptions-${today}.log`,
        })
    ],

    handleRejections: true,
    rejectionHandlers: [
        new winston.transports.File({
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV || 'no-environment'}/rejections-${today}.log`,
        })
    ]
})

function argumentsToString(v) {
    var args = Array.prototype.slice.call(v);
    for (var k in args) {
        if (typeof args[k] === "object") {
            // args[k] = JSON.stringify(args[k]);
            args[k] = util.inspect(args[k], false, null, true);
        }
    }
    var str = args.join(" ");
    return str;
}

const DefaultLogger = winston.createLogger(option());

DefaultLogger.info = function () { DefaultLogger.log('info', argumentsToString(arguments)) }
DefaultLogger.error = function () { DefaultLogger.log('error', argumentsToString(arguments)) }
DefaultLogger.warn = function () { DefaultLogger.log('warn', argumentsToString(arguments)) }
DefaultLogger.debug = function () { DefaultLogger.log('debug', argumentsToString(arguments)) }
DefaultLogger.verbose = function () { DefaultLogger.log('verbose', argumentsToString(arguments)) }
DefaultLogger.silly = function () { DefaultLogger.log('silly', argumentsToString(arguments)) }

/**
 * @description Create a new instance of logger
 * @param {import('winston').LoggerOptions} overWrite 
 * @returns {import('winston').Logger}
 */
DefaultLogger.__instance = (overWrite) => {
    let logger = winston.createLogger({ ...option(overWrite.level), ...overWrite })

    logger.info = function () { logger.log('info', argumentsToString(arguments)) }
    logger.error = function () { logger.log('error', argumentsToString(arguments)) }
    logger.warn = function () { logger.log('warn', argumentsToString(arguments)) }
    logger.debug = function () { logger.log('debug', argumentsToString(arguments)) }
    logger.verbose = function () { logger.log('verbose', argumentsToString(arguments)) }
    logger.silly = function () { logger.log('silly', argumentsToString(arguments)) }

    return logger;
}

module.exports = DefaultLogger;