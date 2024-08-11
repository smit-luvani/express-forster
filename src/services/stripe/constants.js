// You can give whatever name. It could be country based account, or business name based account.
const StripeAccount = {
    testingAccount: 'Testing Account'
}

const webhookEvent = {
    customerCreated: 'customer.created',
}

module.exports.StripeAccount = StripeAccount;
module.exports.webhookEvent = webhookEvent;