"use strict";
/**
 * @author Smit Luvani
 * @description Winston is use to log in development environment
 * @module https://www.npmjs.com/package/winston
 */

// Winston Service
// Console Logger for Development Environment

const winston = require('winston'),
    { winston: winston_logger } = require('../../config/default.json'),
    { name } = require('../../../package.json')

const { combine, label, timestamp, printf } = winston.format;

const format = printf(({ level, message, label, timestamp }) => {
    return `[${label}] ${String(new Date(timestamp))} ${level}: ${message}`;
})

const option = {
    level: winston_logger.level,
    format: combine(label({ label: name }), timestamp(), format),
    transports: [new winston.transports.Console()]
}

const logger = winston.createLogger(option)

module.exports = logger;