/**
 * @author Smit Luvani
 * @description Handles Stripe Errors
 * - You can handle stripe errors and return a custom response
 * @param {Stripe} err - Error Object from Stripe Response
 * @see https://docs.stripe.com/error-handling?lang=node
 */
module.exports = (error) => {
    let errorResponseInterface = {
        error_type: error.type,
        message: error.message,
        error: error
    }

    switch (error.type) {
        case 'StripeCardError':
            // A declined card error
            error.message; // => e.g. "Your card's expiration year is invalid."
            errorResponseInterface.error_type = 'StripeCardError';
            errorResponseInterface.message = error.message;
            errorResponseInterface.error = err;
            break;
        case 'StripeRateLimitError':
            // Too many requests made to the API too quickly
            break;
        case 'StripeInvalidRequestError':
            // Invalid parameters were supplied to Stripe's API
            errorResponseInterface.error_type = error.type;
            errorResponseInterface.message = error.message;
            break;
        case 'StripeAPIError':
            // An error occurred internally with Stripe's API
            break;
        case 'StripeConnectionError':
            // Some kind of error occurred during the HTTPS communication
            break;
        case 'StripeAuthenticationError':
            // You probably used an incorrect API key
            break;
        default:
            // Handle any other types of unexpected errors
            break;
    }

    return errorResponseInterface;
}