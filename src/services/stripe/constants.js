const { getENV } = require("../../helpers");

const StripeAccount = {
    canada: 'Canada'
}

const StripeCurrency = {
    [StripeAccount.canada]: 'CAD'
}

const StripeENVKey = {
    [StripeAccount.canada]: {
        public: `STRIPE_CANADA_PUBLISHABLE_KEY`,
        secret: 'STRIPE_CANADA_SECRET_KEY',
        webhook_secret: 'STRIPE_CANADA_WEBHOOK_SECRET'
    }
}

const paymentIntentStatus = {
    requiresPaymentMethod: 'requires_payment_method',
    requiredConfirmation: 'requires_confirmation',
    requiresAction: 'requires_action',
    succeeded: 'succeeded',
    requiresCapture: 'requires_capture',
    processing: 'processing',
    canceled: 'canceled',
}

const webhookEvent = {
    'payment_intent.succeeded': 'payment_intent.succeeded'
}

const accountInfo = {
    [StripeAccount.canada]: {
        publishable_key: getENV(StripeENVKey[StripeAccount.canada].public),
        country_code: 'CA',
        account: StripeAccount.canada,
        currency: StripeCurrency[StripeAccount.canada]
    }
}

module.exports.StripeAccount = StripeAccount;
module.exports.StripeCurrency = StripeCurrency;
module.exports.StripeENVKey = StripeENVKey;
module.exports.paymentIntentStatus = paymentIntentStatus;
module.exports.webhookEvent = webhookEvent;

/**
 * @description Get Stripe Account Info [Do not expose any sensitive information]
 * @param {'Canada'} account 
 * @returns {{
*   publishable_key: string,
*   country_code: string,
*   account: string,
*   currency: string
* }} Stripe Account Info
*/
module.exports.StripeAccountInfo = (account) => accountInfo[account];