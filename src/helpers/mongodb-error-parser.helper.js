const { Error } = require("mongoose");
const httpStatus = require("http-status");
const { logger } = require("../services");

/**
 * @author Smit Luvani
 * @description format MongoServerError to meaning full error
 * @param {Error} error MongoDB/Mongoose Error Instance
 * @returns {{
 * name: string,
 * code: number,
 * httpStatus: number,
 * message: string,
 * duplicateKey?: string,
 * _json?: object
 * }}
 */
module.exports = (error) => {
    logger.info("Helpers > MongoDB Error Parser")
    if (!error instanceof Error) {
        return error;
    }

    var returnObject = {
        name: error.name,
        code: error.code,
        message: error.message,
        httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
        stack: error.stack,
        _parser: 'Helpers > MongoDB Error Parser',
    };

    try {
        returnObject._json = JSON.parse(JSON.stringify(error))
    } catch (error) { }

    switch (error.code) {
        case 11000:
            returnObject.duplicateKey = error?.keyValue ? Object.keys(error.keyValue) : undefined;
            returnObject.message = `${returnObject?.duplicateKey?.join(',')} already exists.`;
            returnObject.httpStatus = httpStatus.BAD_REQUEST;
            break;
    }

    switch (error.name) {
        case 'CastError':
            returnObject.message = `${error.path} is invalid.` + ` ${error.value} is not a valid ${error.kind}. `;
            break;
    }

    return returnObject;
};