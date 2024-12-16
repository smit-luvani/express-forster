const getENV = require("../helpers/get-env");

// You can add common or constant here
const environments = {
    development: 'development',
    production: 'production'
}
module.exports.environments = environments;
module.exports.CURRENT_ENVIRONMENT = getENV('NODE_ENV')

module.exports.paymentGateway = {
    razorpay: 'RAZORPAY', // Registered Email: <email> (Merchant ID: <ID>)
};