const { Error } = require("mongoose");
const httpStatus = require("http-status");

/**
 * @author Smit Luvani
 * @description format MongoServerError to meaning full error
 * @param {Error} error MongoDB/Mongoose Error Instance
 * @returns {{
 * name: string,
 * code: number,
 * httpStatus: number,
 * message: string,
 * duplicateKey?: string}}
 */
module.exports = (error) => {
    if (!error instanceof Error) {
        return error;
    }

    var returnObject = {
        name: error.name,
        code: error.code,
        message: error.message,
        httpStatus: httpStatus.INTERNAL_SERVER_ERROR
    };

    switch (error.code) {
        case 11000:
            returnObject.duplicateKey = error?.keyValue ? Object.keys(error.keyValue) : undefined;
            returnObject.message = `${returnObject?.duplicateKey?.join(',')} already exists.`;
            returnObject.httpStatus = httpStatus.BAD_REQUEST;
            break;
    }

    return returnObject;
};