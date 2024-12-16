const { isUndefined } = require('lodash');

/**
 * @typedef {Object} PaginationOptions
 * @property {number} skip
 * @property {number} limit
 * @property {number} page
 * @property {number} maxLimit
 * @property {boolean} defaultValues - If true, it will return default values for skip 0, limit 25 and page 1
 */

/**
 *
 * @param {PaginationOptions} params
 */
const getPagination = (params = {}) => {
	let { skip, limit, page, maxLimit, defaultValues } = params;

	if (defaultValues === true && isUndefined(skip) && isUndefined(limit) && isUndefined(page)) {
		return { skip: 0, limit: 25, page: 1 };
	}

	if (isUndefined(skip) && isUndefined(limit) && isUndefined(page) && !isUndefined(page) && page == 0) {
		return { skip: undefined, limit: undefined, page: undefined };
	}

	// Validate limit
	if (isUndefined(limit)) {
		limit = maxLimit || 0;
	} else {
		limit = parseInt(limit);

		if (isNaN(limit)) limit = 0;

		if (limit < 0) {
			limit = 0;
		}

		if (maxLimit) limit = Math.min(limit, maxLimit);
	}

	// Avoid skip if page is provided
	if (!isUndefined(page)) {
		page = parseInt(page);

		if (isNaN(page)) page = 0;

		page = Math.max(page, 1);

		skip = (page - 1) * limit;
	} else if (!isUndefined(skip)) {
		skip = parseInt(skip);

		if (isNaN(skip)) skip = 0;
		skip = Math.max(skip, 0);
	} else {
		skip = 0;
	}

	page = parseInt(skip / limit) + 1;

	if (isNaN(page)) page = 0;
	if (isNaN(limit)) limit = 0;
	if (isNaN(skip)) skip = 0;

	return {
		skip,
		limit,
		page,
		maxLimit,
	};
};
module.exports.getPagination = getPagination;

const countPages = (totalDocs, limit) => {
	if (limit == 0) return 1;
	return Math.ceil(totalDocs / limit);
};

const getRemainingDocs = (totalDocs, skip, limit) => {
	return Math.max(totalDocs - (skip + limit), 0);
};

/**
 *
 * @param {number} totalDocs
 * @param {{skip: number, limit: number, page: number}} param1
 * @returns {{skip: number, limit: number, page: number, totalDocs: number, totalPages: number, remainingDocs: number, remainingPages: number, maxLimit?: number, maxLimitExceeded?: boolean, '?maxLimit'?: string}}
 */
const generatePaginationSummary = (totalDocs, { skip, limit, page, ...otherOptions }) => {
	let pg = getPagination({ skip, limit, page }, otherOptions);
	let info = {
		...pg,
		totalDocs,
		totalPages: countPages(totalDocs, pg.limit),
		remainingDocs: getRemainingDocs(totalDocs, pg.skip, pg.limit),
		remainingPages: Math.max(countPages(totalDocs, pg.limit) - pg.page, 0),
	};

	info.hasNext = info.remainingPages > 0;

	try {
		if (pg.maxLimit)
			Object.assign(info, {
				maxLimit: pg.maxLimit,
				maxLimitExceeded: limit > pg.maxLimit,
				explanation: {
					'?maxLimit': 'This is the maximum limit set for this request. maxLimit is maximum limit applied to query and maxLimitExceeded is true if limit value in query is more than maxLimit.',
				},
			});
	} catch (error) {
		console.error(error);
	}

	return info;
};
module.exports.generatePaginationSummary = generatePaginationSummary;
