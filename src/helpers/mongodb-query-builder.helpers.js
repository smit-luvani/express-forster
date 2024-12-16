const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');

/**
 * @author Smit Luvani
 * @description It will return the query object for the search text
 * - It supports array fields and array of object fields.
 * - To search in array object fields, use `[]` in the field name. Currently, it supports only one level of nesting.
 * - Example: array_field[].child_field
 * - limitation: It does not support any conversion of the field value. It will search as it is. So make sure to pass the correct value type.
 * - Some field does not support regex search options. So, it may not work as expected. For example, _id field. Avoid using it.
 * - To search in array directly, use `[]` in the field name.
 * - Example: array_field[]
 * - limitation: It does not support any conversion of the field value. It will search as it is. So make sure to pass the correct
 * - It does not support regex search options.
 * - It will most likely work with the string fields. For other fields, it may not work as expected.
 * @param {string|number|boolean} searchText
 * @param {string[]} fields
 * @param {{ operator: 'and' | 'or', case_sensitive: boolean }} options
 * @returns
 */

function searchText(searchText, fields, options = {}) {
	if (!searchText) return {};

	const { operator = 'or', case_sensitive = false } = options;

	if (['and', 'or'].indexOf(operator) === -1) throw new Error('Invalid operator');
	if (!Array.isArray(fields)) fields = [fields];

	const normalFields = [];
	const arrayOfObjectsFields = [];
	const arrayFields = [];

	fields.forEach((field) => {
		if (field.includes('[].')) {
			arrayOfObjectsFields.push(field.replace('[]', ''));
		} else if (field.includes('[]')) {
			arrayFields.push(field.replace('[]', ''));
		} else {
			normalFields.push(field);
		}
	});

	const normalFieldQueries = normalFields.map((field) => ({
		$expr: {
			$and: [
				{ $ne: [`$${field}`, null] },
				{
					$regexMatch: {
						input: {
							$cond: {
								if: { $isArray: `$${field}` },
								then: '', // Return empty string if it's an array (or handle differently if needed)
								else: { $toString: { $ifNull: [`$${field}`, ''] } },
							},
						},
						regex: searchText,
						options: case_sensitive === false ? 'i' : '',
					},
				},
			],
		},
	}));

	const arrayFieldQueries = arrayFields.map((field) => ({
		[field]: {
			$elemMatch: {
				$ne: null,
				$in: [new RegExp(searchText, case_sensitive === false ? 'i' : '')],
			},
		},
	}));

	const arrayOfObjectFieldQueries = arrayOfObjectsFields.map((field) => {
		let [arrayField, childField] = field.split('.');

		return {
			$expr: {
				$gt: [
					{
						$size: {
							$filter: {
								input: {
									$cond: {
										if: { $isArray: `$${arrayField}` },
										then: `$${arrayField}`,
										else: [],
									},
								},
								as: 'item',
								cond: {
									$and: [
										{ $ne: [`$$item.${childField}`, null] },
										{
											$regexMatch: {
												input: { $toString: `$$item.${childField}` },
												regex: searchText,
												options: case_sensitive ? '' : 'i',
											},
										},
									],
								},
							},
						},
					},
					0,
				],
			},
		};
	});

	return {
		[`$${operator}`]: [...normalFieldQueries, ...arrayFieldQueries, ...arrayOfObjectFieldQueries],
	};
}
module.exports.searchTextQuery = searchText;

function sortQuery(sort, sortOrder) {
	if (!sort || !sortOrder) return {};

	return {
		[sort]: sortOrder === 'asc' ? 1 : -1,
	};
}
module.exports.sortQuery = sortQuery;

/**
 * @description This is wrapper but prevent if value is already an ObjectId object.
 * @param {string | ObjectId} value
 * @returns {import('mongoose').ObjectId}
 */
function convertToObjectId(value) {
	if (isValidObjectId(value)) {
		return ObjectId.createFromHexString(String(value));
	}

	throw new Error('Invalid ObjectId');
}
module.exports.convertToObjectId = convertToObjectId;

/**
 * @description This is wrapper but convert JSON object, because mongoose.isValidObjectId returns true for JSON object.
 * @param {string | ObjectId} value
 */
function isValidObjectId(value) {
	return mongoose.isValidObjectId(String(value));
}
module.exports.isValidObjectId = isValidObjectId;
