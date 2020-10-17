// Export All Services

/**
 * [RECOMMEND] Use Particular Service instead of all service
 * All services requires all node modules so use particular service as per need is good to implement
 * ex. const mongoose = require('./mongoose')
 */

module.exports = {
    NODE_ENV: require('./NODE_ENV'), // Do not comment this, Used in many services
    winston: require('./winston'),
    mongoose: require('./mongoose'),
    firebaseAdmin: require('./firebase-admin'),
    jwt: require('./jwt'),
    bcryptjs: require('./bcryptjs'),
}

// To Disable, Use Single Line Comment

// Service Log
// Enable/Disable Service Logging in config/default.json file