let JoiBase = require('joi');
JoiBase = JoiBase.extend(require('@joi/date'));

const Joi = JoiBase.defaults((schema) =>
	schema.options({
		messages: {
			'string.objectId': '{{#label}} must be a valid ObjectId',
			'any.only': '{{#label}} must be one of {{#valids}}, but you passed: {{#value}}',
		},
		cache: true,
		errors: {
			wrap: {
				label: false,
			},
		},
	})
);

/**
 * @return {import('joi')}
 */
module.exports = Joi;
