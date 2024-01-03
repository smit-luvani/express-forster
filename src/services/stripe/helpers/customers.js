/**
 * @author Smit Luvani
 * @description Stripe Customer SDK 
 * @tutorial https://stripe.com/docs/api/customers
 * 
 * @param {Stripe} stripeObject - Stripe SDK Object
 */

const logger = require('../../winston')
const Stripe = require('stripe')
const StripeValidators = require('./validators')
const { isUndefined } = require('lodash')
const { v5: UUID, v4: UUID4 } = require('uuid')

/**
 * @author Smit Luvani
 * @description Creates a new customer object in Stripe with the provided information.
 * @param {object} stripeObject - The Stripe object used to perform API requests.
 * @param {object} options - An object containing optional parameters for creating a new customer object.
 * @param {string} [options.description] - A description of the customer.
 * @param {string} [options.email] - The email address of the customer.
 * @param {object} [options.metadata] - Metadata associated with the customer.
 * @param {string} [options.name] - The name of the customer.
 * @returns {Promise<object>} - A Promise that resolves with the newly created customer object.
 * @throws {Error} - Throws an error if the Stripe object is invalid.
 */
module.exports.createCustomer = (stripeObject, { description, email, metadata, name } = {}) => new Promise((resolve, reject) => {
    logger.verbose('Service [Stripe > Helpers > Customers]: createCustomer')

    if (StripeValidators.isStripeObject(stripeObject) == false) {
        return reject(new Error('Stripe Object is not valid'))
    }

    // Stripe Payload
    let stripeCustomerPayload = {}
    email ? stripeCustomerPayload.email = email : null
    name ? stripeCustomerPayload.name = name : null
    description ? stripeCustomerPayload.description = description : null
    metadata ? stripeCustomerPayload.metadata = metadata : null

    const idempotencyKey = UUID(UUID.DNS, UUID4())

    return stripeObject.customers.create(stripeCustomerPayload, { idempotencyKey }).then(result => resolve(result)).catch(error => reject(error))
})

/**
 * @author Smit Luvani
 * @description Retrieves a customer object from Stripe with the specified customer ID.
 * @param {object} stripeObject - The Stripe object used to perform API requests.
 * @param {string} customerID - The ID of the customer object to retrieve.
 * @returns {Promise<object>} - A Promise that resolves with the customer object that matches the specified customer ID.
 * @throws {Error} - Throws an error if the Stripe object is invalid or if the customerID parameter is undefined.
*/
module.exports.getCustomer = (stripeObject, customerID) =>
    new Promise((resolve, reject) => {
        logger.verbose('Service [Stripe > Helpers > Customers]: getCustomer')

        if (StripeValidators.isStripeObject(stripeObject) == false) {
            return reject(new Error('Stripe Object is not valid'))
        }

        if (isUndefined(customerID)) {
            return reject(new Error('customerID is undefined'))
        }

        return stripeObject.customers.retrieve(customerID).then(result => resolve(result)).catch(error => reject(error))
    })

/**
 * @author Smit Luvani
 * @description Retrieves a list of customer objects from Stripe that match the provided email address.
 * @param {object} stripeObject - The Stripe object used to perform API requests.
 * @param {object} options - An object containing optional parameters for filtering the customer list.
 * @param {number} [options.limit] - The maximum number of customer objects to retrieve.
 * @param {string} options.email - The email address to match against customer objects.
 * @returns {Promise<object>} - A Promise that resolves with a list of customer objects that match the provided email address.
 * @throws {Error} - Throws an error if the Stripe object is invalid or if the email parameter is undefined.
 */
module.exports.listCustomer = (stripeObject, { limit, email }) =>
    new Promise((resolve, reject) => {
        logger.verbose('Service [Stripe > Helpers > Customers]: listCustomer')

        if (StripeValidators.isStripeObject(stripeObject) == false) {
            return reject(new Error('Stripe Object is not valid'))
        }

        if (isUndefined(email)) {
            return reject(new Error('email is undefined'))
        }

        return stripeObject.customers.list({ limit, email }).then(result => resolve(result)).catch(error => reject(error))
    })

/**
 * @author Smit Luvani
 * @description Retrieves an existing Stripe customer object or creates a new one if it doesn't exist.
 * @param {object} stripeObject - The Stripe object used to perform API requests.
 * @param {object} options - An object containing optional parameters for creating a new customer object.
 * @param {string} [options.email] - The email address of the customer.
 * @param {string} [options.name] - The name of the customer.
 * @returns {Promise<object>} - A Promise that resolves with the customer object if it exists or was successfully created.
 * @throws {Error} - Throws an error if the Stripe object is invalid or if the email parameter is undefined.
 * @returns 
 */
module.exports.getOrCreateCustomer = (stripeObject, { email, name } = {}) =>
    new Promise((resolve, reject) => {
        logger.verbose('Service [Stripe > Helpers > Customers]: getOrCreateCustomer')

        if (StripeValidators.isStripeObject(stripeObject) == false) {
            return reject(new Error('Stripe Object is not valid'))
        }

        if (isUndefined(email)) {
            return reject(new Error('email is undefined'))
        }

        return this.listCustomer(stripeObject, { email }).then(result => {
            if (result.data.length > 0) {
                return resolve(result.data[0])
            }

            return this.createCustomer(stripeObject, { email, name }).then(result => resolve(result)).catch(error => reject(error))
        }).catch(error => reject(error))
    })