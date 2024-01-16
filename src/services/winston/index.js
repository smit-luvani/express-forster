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
 * 
 * @returns {winston.createLogger}
 */

const winston = require('winston');
const hideSensitiveValue = require('../../utils/hide-sensitive-value')

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
        const ReqId = `[${requestId}]` || '';
        if (typeof message === 'object') message = JSON.stringify(hideSensitiveValue(message))

        return `[${timestamp}][${level}]${ReqId}: ${String(message)}`;
    }))

const fileLogFormat = combine(
    errors({ stack: true }),
    json(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
    printf(({ level, message, timestamp, requestId }) => {
        const ReqId = `[${requestId}]` || '';
        if (typeof message === 'object') message = JSON.stringify(hideSensitiveValue(message))

        return `[${timestamp}][${level}]${ReqId}: ${String(message)}`;
    }))

const today = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`

const option = {
    transports: [
        new winston.transports.Console({
            level: logLevel,
            format: logFormat
        }),
        new winston.transports.File({
            level: logLevel,
            format: fileLogFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV || 'no-environment'}/stdout-${today}.log`,
        }),
        new winston.transports.File({
            level: 'error',
            format: fileLogFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV || 'no-environment'}/error-${today}.log`,
        })
    ]
}

module.exports = winston.createLogger(option)