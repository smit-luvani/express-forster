/**
 * @author Smit Luvani
 * @description Authorize Stripe and return the Stripe object
 */

const Stripe = require('stripe');
const { getENV } = require('../../helpers')
const logger = require('../winston')
const { StripeENVKey } = require('./constants');

try {
    /**
     * @description Stripe Object for Any account
     * @param {String} account Stripe Account
     * @returns {Stripe} Stripe Object
     */
    module.exports = (account) => Stripe(getENV(StripeENVKey[account].secret), { apiVersion: '2022-11-15' });
} catch (error) {
    logger.error('Service [Stripe]: ' + error?.message || error?.stack);
}