const { Error: MongoDBError } = require('mongoose');
const logger = require('../services/winston');
const { httpStatus } = require('../services');

/**
 * @author Smit Luvani
 * @description format MongoServerError to meaning full error
 * @param {MongoDBError} error MongoDB/Mongoose Error Instance
 * @returns {{
 * name: string,
 * code: number,
 * httpStatus: number,
 * message: string,
 * duplicateKey?: string|string[],
 * stack: string,
 * _parser: string}}
 */
module.exports = (error) => {
	logger.silly('Helpers > MongoDB Error Parser');
	if ((!error) instanceof MongoDBError) {
		return error;
	}

	var returnObject = {
		isMongoError: true,
		name: error.name,
		message: error.message,
		httpStatus: httpStatus.INTERNAL_SERVER_ERROR,
		error: error,
		_parser: 'Helpers > MongoDB Error Parser',
	};

	switch (error.code) {
		case 11000:
			returnObject.duplicateKey = error?.keyValue ? Object.keys(error.keyValue) : undefined;
			returnObject.message = `${returnObject?.duplicateKey?.join(',')} already exists.`;
			returnObject.httpStatus = httpStatus.BAD_REQUEST;
			break;
	}

	switch (error.name) {
		case 'CastError':
			returnObject.httpStatus = httpStatus.BAD_REQUEST;
			returnObject.message = `${error.path} is invalid.` + ` ${error.value} is not a valid ${error.kind}. `;
			break;
		case 'DocumentNotFoundError':
			returnObject.httpStatus = httpStatus.NOT_FOUND;
			returnObject.message = 'Document not found.';
			break;
	}

	return returnObject;
};
