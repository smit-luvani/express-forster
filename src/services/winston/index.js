/**
 * @author Smit Luvani
 * @description Winston is use to log in development environment
 * @module https://www.npmjs.com/package/winston
 */

// Winston Service
// Console Logger for Development Environment

const winston = require('winston'),
    { winston: winston_logger } = require('../../config/default.js')
const hideSensitiveValue = require('../../utils/hide-sensitive-value')

const { combine, timestamp, printf, json } = winston.format;

const logFormat = combine(
    json(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
    printf(({ level, message, timestamp }) => {
        if (typeof message === 'object') message = hideSensitiveValue(message)
        typeof message === 'object' ? message = JSON.stringify(message) : null;
        return `${timestamp} [${level}]: ${String(message)}`;
    }))

const today = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`

const option = {
    transports: [
        new winston.transports.Console({
            level: winston_logger.level,
            json: true,
            prettyPrint: true,
            format: logFormat
        }),
        new winston.transports.File({
            format: logFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV || 'no-environment'}/stdout-${today}.log`,
            json: true
        }),
        new winston.transports.File({
            format: logFormat,
            filename: process.cwd() + `/.logs/${process.env.NODE_ENV || 'no-environment'}/error-${today}.log`,
            json: true,
            level: 'error'
        })
    ]
}

module.exports = winston.createLogger(option)