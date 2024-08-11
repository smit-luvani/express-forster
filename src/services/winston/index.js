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
const path = require('path');

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

const logDir = path.join(process.cwd(), '.logs', process.env.NODE_ENV || 'no-environment');
const { combine, timestamp, printf, json, errors, colorize, metadata } = winston.format;

const logFormat = combine(
    errors({ stack: true }),
    json(),
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
    printf(({ level, message, timestamp, requestId }) => {
        const ReqId = requestId ? `[${requestId}]` : '';
        if (typeof message === 'object') message = JSON.stringify(hideSensitiveValue(message));

        return `[${timestamp}][${level}]${ReqId}: ${String(message)}`;
    }))

const today = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`

// Define transport options
const transportOptions = {
    console: {
        level: logLevel,
        format: logFormat
    },
    file: {
        level: logLevel,
        format: logFormat,
        filename: path.join(logDir, `stdout-${today}.log`)
    },
    errorFile: {
        level: 'error',
        format: logFormat,
        filename: path.join(logDir, `error-${today}.log`)
    },
    exceptions: {
        format: logFormat,
        filename: path.join(logDir, `exceptions-${today}.log`)
    },
    rejections: {
        format: logFormat,
        filename: path.join(logDir, `rejections-${today}.log`)
    }
};

const Logger = winston.createLogger({
    level: logLevel,
    format: logFormat,
    transports: [
        new winston.transports.Console(transportOptions.console),
        new winston.transports.File(transportOptions.file),
        new winston.transports.File(transportOptions.errorFile)
    ],
    exceptionHandlers: [
        new winston.transports.File(transportOptions.exceptions)
    ],
    rejectionHandlers: [
        new winston.transports.File(transportOptions.rejections)
    ],
    handleExceptions: true,
    handleRejections: true
});

function argumentsToString(v) {
    return Array.from(v).map(arg => typeof arg === 'object' ? util.inspect(arg, { depth: null, colors: true }) : arg).join(' ');
}
['info', 'error', 'warn', 'debug', 'verbose', 'silly'].forEach(level => Logger[level] = (...args) => Logger.log(level, argumentsToString(args)));

module.exports = Logger;