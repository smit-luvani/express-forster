/**
 * @description Validates Values for Stripe
 */

const Stripe = require('stripe')
const { default: TypeStripe } = require('stripe')

/**
 * @description Check if the Stripe Object is valid
 * @param {TypeStripe} stripeObject 
 * @returns {boolean}
 */
module.exports.isStripeObject = (stripeObject) => stripeObject instanceof Stripe