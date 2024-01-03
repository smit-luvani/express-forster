/**
 * @author Smit Luvani
 * @description Stripe Payment Intent SDK 
 * @tutorial https://stripe.com/docs/api/payment_intents
 */

const logger = require('../../winston')
const StripeValidators = require('./validators')
const { isUndefined, isInteger } = require('lodash')
const { v5: UUID, v4: UUID4 } = require('uuid')
const { StripeCurrency, paymentIntentStatus } = require('../constants')

/**
 * @author Smit Luvani
 * @description Retrieves a list of Payment Intents associated with the provided customer ID.
 * @param {Stripe} stripeObject - The Stripe object to use for the request.
 * @param {string} customer_id - The ID of the customer to retrieve Payment Intents for.
 * @param {number} [limit=100] - The maximum number of Payment Intents to retrieve per request (default: 100).
 * @param {string} [starting_after] - The ID of the Payment Intent to start retrieving after (for pagination).
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the retrieved Payment Intents.
 * @throws {Error} - Throws an error if the provided Stripe object is not valid or the customer_id is undefined.
 */
module.exports.listPaymentIntents = (stripeObject, { customer_id, limit = 100, starting_after } = {}) =>
    new Promise((resolve, reject) => {
        logger.verbose('Service [Stripe > Helpers > Payment Intent]: listPaymentIntents')

        if (StripeValidators.isStripeObject(stripeObject) == false) {
            return reject(new Error('[listPaymentIntents]: Stripe Object is not valid'))
        }

        if (isUndefined(customer_id)) {
            return reject(new Error('[listPaymentIntents]: customer_id is undefined'))
        }

        let queryPayload = {
            customer: customer_id,
            limit: limit,
        }

        if (!isUndefined(starting_after)) {
            queryPayload.starting_after = starting_after
        }

        return stripeObject.paymentIntents.list(queryPayload).then(result => resolve(result)).catch(error => reject(error));
    })

/**
 * @author Smit Luvani
 * @description Retrieves a Payment Intent object.
 */
const getUnpaidPaymentIntents = (stripeObject, { item_id, customer_id, currency, banner_id } = {}, { starting_after_offset, limit = 50 } = {}) =>
    new Promise((resolve, reject) => {
        logger.verbose('Service [Stripe > Helpers > Payment Intent]: getUnpaidPaymentIntents')

        /**
         * It will return payment intent if payment for specific product and product type is not paid but order created previously.
         * It prevent duplicate payment intent for same product and product type. Recommended by Stripe to see attempts log.
         */

        if (StripeValidators.isStripeObject(stripeObject) == false) {
            return reject(new Error('[getUnpaidPaymentIntents]: Stripe Object is not valid'))
        }

        if (isUndefined(item_id)) {
            return reject(new Error('[getUnpaidPaymentIntents]: item_id is undefined'))
        }

        if (isUndefined(customer_id)) {
            return reject(new Error('[getUnpaidPaymentIntents]: customer_id is undefined'))
        }

        return this.listPaymentIntents(stripeObject, { customer_id, starting_after: starting_after_offset, limit: limit })
            .then(result => {
                if (result?.data?.length > 0) {
                    let lookup = result.data.find(intent =>
                        intent.status != paymentIntentStatus.succeeded
                        && intent.metadata.item_id == item_id
                        && (banner_id ? String(intent.metadata?.banner_id) == String(banner_id) : true)
                        && String(intent.currency).toUpperCase() == String(currency).toUpperCase())
                    if (lookup) {
                        return resolve(lookup)
                    } else {
                        // FIXME: This may not work. Need to test it.
                        return getUnpaidPaymentIntents(stripeObject, { item_id, customer_id }, { starting_after_offset: result.data[result.data.length - 1].id })
                            .then(result => resolve(result))
                            .catch(error => reject(error))
                    }
                } else {
                    return resolve(null)
                }
            })
            .catch(error => reject(error))
    })
module.exports.getUnpaidPaymentIntents = getUnpaidPaymentIntents;

/**
 * @author Smit Luvani
 * @description Creates a payment intent on Stripe.
 * 
 * @param {object} stripeObject - The Stripe object.
 * @param {string} stripeAccountName - The name of the Stripe account.
 * @param {object} options - An object containing payment intent options.
 * @param {number} options.amount - The amount to charge in cents or minor units.
 * @param {string} options.currency - The currency in which to charge the payment.
 * @param {string} options.customer_id - The ID of the customer to attach the payment to.
 * @param {string} [options.description] - A description of the payment intent.
 * @param {object} [options.metadata] - Custom metadata to be stored with the payment intent.
 * 
 * @returns {Promise<object>} A promise that resolves with the payment intent object if successful.
 * 
 * @throws {Error} If the Stripe object is not valid, the amount is undefined, the amount is not an integer, the amount is less than 50, the currency is undefined, the currency is not valid, or the customer ID is undefined.
 */
module.exports.createPaymentIntent = (stripeObject, stripeAccountName, { amount, currency, customer_id, description, metadata } = {}) =>
    new Promise((resolve, reject) => {
        logger.verbose('Service [Stripe > Helpers > Payment Intent]: createPaymentIntent')

        /**
         * @param {Number} amount - Amount in cents or minor units. For example, if you want to charge $50.00, pass amount = 500.
         * @param {String} currency - 3-letter ISO code for currency.
         * @param {String} customer_id - ID of the customer to attach the payment to (must be generated from same Stripe Account that passed as object). (To draw attention to the developer, warning logs are generated if the customer ID is not provided.)
         * @param {String} description - Description of the payment intent.
         * @param {Object} metadata - Custom metadata to be stored with the payment intent.
         */

        if (StripeValidators.isStripeObject(stripeObject) == false) {
            return reject(new Error('[createPaymentIntent]: Stripe Object is not valid'))
        }

        if (!amount) {
            return reject(new Error('[createPaymentIntent]: amount is undefined'))
        }

        if (!isInteger(amount) || amount < 50) {
            return reject(new Error('[createPaymentIntent]: amount is not valid. It must be integer and greater than 50 (minimum unit of any currency)'))
        }

        if (!currency) {
            return reject(new Error('[createPaymentIntent]: currency is undefined'))
        }

        currency = String(currency).trim().toUpperCase().substring(0, 3) // First 3 characters of currency code

        if (Object.values(StripeCurrency).includes(currency) == false) {
            return reject(new Error('[createPaymentIntent]: currency is not supported'))
        }

        if (!customer_id) {
            return reject(new Error('[createPaymentIntent]: customer_id is undefined'))
        }

        let paymentIntentPayload = {
            amount: amount,
            currency: currency,
            customer: customer_id,
        }

        if (description) paymentIntentPayload.description = description;

        paymentIntentPayload.metadata = {
            generatedBy: 'Express-Forster-API-v1.0', // Must be provided
            environment: process.env.NODE_ENV, // Must be provided
            stripeAccount: stripeAccountName,
        }

        if (metadata && Object.keys(metadata).length > 0) paymentIntentPayload.metadata = { ...paymentIntentPayload.metadata, ...metadata }

        // Idempotent Key [Important to Identify Duplicate Callback from Stripe]
        const idempotencyKey = UUID(UUID.DNS, UUID4())

        return stripeObject.paymentIntents.create(paymentIntentPayload, { idempotencyKey }).then(result => resolve(result)).catch(error => reject(error))
    })

/**
 * @author Smit Luvani
 * @description Retrieves a PaymentIntent object from Stripe API by its ID.
 *
 * @param {Object} stripeObject - Stripe object containing API credentials.
 * @param {string} payment_intent_id - ID of the PaymentIntent to retrieve.
 *
 * @returns {Promise<Object>} Promise that resolves with the PaymentIntent object from Stripe API.
 *
 * @throws {Error} If Stripe object is invalid or payment_intent_id is undefined.
 */
module.exports.getPaymentIntent = (stripeObject, payment_intent_id) =>
    new Promise((resolve, reject) => {
        logger.verbose('Service [Stripe > Helpers > Payment Intent]: getPaymentIntent')

        if (StripeValidators.isStripeObject(stripeObject) == false) {
            return reject(new Error('[getPaymentIntent]: Stripe Object is not valid'))
        }

        if (!payment_intent_id) {
            return reject(new Error('[getPaymentIntent]: payment_intent_id is undefined'))
        }

        return stripeObject.paymentIntents.retrieve(payment_intent_id).then(result => resolve(result)).catch(error => reject(error))
    })
/**
 * @author Smit Luvani
 * @description Update an existing Payment Intent with custom metadata.
 *
 * @param {Object} stripeObject - Stripe object to interact with the API.
 * @param {string} payment_intent_id - ID of the Payment Intent to update.
 * @param {Object} options - Object containing optional parameters.
 * @param {Object} options.metadata - Custom metadata to be stored with the Payment Intent.
 *
 * @returns {Promise<Object>} Returns a Promise containing the updated Payment Intent object.
 *
 * @throws {Error} Rejects with an error if Stripe Object is not valid.
 * @throws {Error} Rejects with an error if Payment Intent ID is undefined.
 * @throws {Error} Rejects with an error if an error occurs while updating the Payment Intent.
 */
module.exports.updatePaymentIntent = (stripeObject, payment_intent_id, { metadata } = {}) =>
    new Promise(async (resolve, reject) => {
        logger.verbose('Service [Stripe > Helpers > Payment Intent]: updatePaymentIntent')

        if (StripeValidators.isStripeObject(stripeObject) == false) {
            return reject(new Error('[createPaymentIntent]: Stripe Object is not valid'))
        }

        // Get Payment Intent
        let getPaymentInfo;
        try {
            getPaymentInfo = await this.getPaymentIntent(stripeObject, payment_intent_id)
        } catch (error) {
            return reject(error)
        }

        let metadataPayload = { ...getPaymentInfo.metadata }
        if (metadata && typeof metadata == 'object') {
            // update metadata what is passed in
            metadataPayload = {
                ...metadataPayload,
                ...metadata,
            }
        }

        let updatePayload = {
            metadata: metadataPayload
        }

        return stripeObject.paymentIntents.update(payment_intent_id, updatePayload).then(result => resolve(result)).catch(error => reject(error));
    })