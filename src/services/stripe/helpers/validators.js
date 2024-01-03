/**
 * @description Validates Values for Stripe
 */

const Stripe = require('stripe')

module.exports.isStripeObject = (stripeObject) => stripeObject instanceof Stripe