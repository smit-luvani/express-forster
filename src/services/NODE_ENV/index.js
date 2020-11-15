"use strict";
/**
 * @author Smit Luvani
 * @description Check Running Environment for Node
 */

const express = require('express'),
    logger = require('../winston'),
    { logging } = require('../../config/default.json');

// Environment
const NODE_ENV = String(process.env.NODE_ENV).trim() || 'development';

module.exports = (req, res, next) => {
    switch (NODE_ENV) {
        case 'development':
        case 'production':
            process.env.NODE_ENV = String(process.env.NODE_ENV).trim()
            logging.NODE_ENV ? logger.info(`Server: \x1b[32m\x1b[1m PORT: ${(process.env.PORT || 80)} \x1b[0m || \x1b[32m\x1b[1m NODE_ENV: ${process.env.NODE_ENV} \x1b[0m `) : null;
            next()
            break;
        default:
            logger.error('APP [NODE_ENV]: NODE_ENV is not valid. Use "development" or "production"')
            return res.json({
                message: "Health: Sick",
                reason: "Node Environment is not valid"
            })
    }
}