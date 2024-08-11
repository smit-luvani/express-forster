const Stripe = require('stripe');
const { getENV } = require('../../helpers')
const logger = require('../winston')
const { StripeAccount } = require('./constants');
const { default: TypeStripe } = require('stripe');
const getEnv = require('../../helpers/get-env');

const StripeENVKey = {
    // Define Stripe Account and its Environment Key
    [StripeAccount.testingAccount]: {
        stripePublishableKey: `STRIPE_TESTING_AC_PUBLISHABLE_KEY`,
        secret: 'STRIPE_TESTING_AC_SECRET_KEY',
        webhook_secret: getEnv('STRIPE_LOCAL_ENDPOINT_SECRET') || 'STRIPE_TESTING_AC_WEBHOOK_SECRET'
    },
}

try {
    /**
     * @description Stripe Object for Any account
     * @param {('Testing Account')} account Stripe Account
     * @returns {TypeStripe} Stripe Object
    */
    module.exports = (account) => Stripe(getENV(StripeENVKey[account].secret), { apiVersion: '2024-06-20' });
} catch (error) {
    logger.error('Service [Stripe]:', error);
}
