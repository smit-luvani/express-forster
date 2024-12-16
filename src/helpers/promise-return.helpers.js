const { pickBy } = require('lodash');
const { ValidationError } = require('../services/Joi');
const { httpStatus } = require('../services');

/**
 * @author Smit Luvani
 * @description Format success or error object for response
 *
 * Supported Error Handling:
 * 	- Joi Validation Error
 * 	- Custom Error from Paypal SDK
 * 	- Error Object
 *
 * @param {number| Error | import("joi").ValidationError} status HTTP Status Code or Error Object
 * @param {string} [message] Message for response
 * @param {object| Error | import("joi").ValidationError} [data] Data for response
 * @param {string} [customCode] Custom Code for response
 * @param {object} [metadata] Metadata for response
 * @typedef {{status: number, message: string, data: object, customCode: string, metadata: object}} PromiseReturnType
 * @returns {PromiseReturnType}
 */
module.exports = (status, message, data, customCode, metadata) => {
	let returnObject = {
		status: httpStatus.INTERNAL_SERVER_ERROR,
	};

	if (status instanceof ValidationError && status.isJoi) {
		returnObject.status = httpStatus.BAD_REQUEST;
		returnObject.message = status.message;
		returnObject.data = status.details;
		returnObject.customCode = customCode;
		returnObject.metadata = metadata;
		return returnObject;
	} else if (status instanceof Error) {
		let cloneStatus = status;
		returnObject.status = httpStatus.INTERNAL_SERVER_ERROR;
		returnObject.message = cloneStatus.message;
		returnObject.data = cloneStatus;
		returnObject.customCode = cloneStatus.code || customCode;
		returnObject.metadata = cloneStatus.metadata || metadata;
		return returnObject;
	} else if (typeof status === 'object') {
		let cloneStatus = status;
		returnObject.status = cloneStatus.status || httpStatus.INTERNAL_SERVER_ERROR;
		returnObject.message = cloneStatus.message;
		returnObject.data = cloneStatus.data;
		returnObject.customCode = cloneStatus.customCode || customCode;
		returnObject.metadata = cloneStatus.metadata || metadata;
		return returnObject;
	} else {
		returnObject.status = status || undefined;
		returnObject.message = message || undefined;
		returnObject.data = data || undefined;
		returnObject.customCode = customCode || undefined;
		metadata ? (returnObject.metadata = metadata) : undefined;
		return pickBy(returnObject);
	}
};
