/**
 * @author Smit Luvani
 * @description Set Firebase Admin SDK
 * @module https://www.npmjs.com/package/firebase-admin
 * @tutorial https://www.npmjs.com/package/firebase-admin#documentation
 */

const firebaseAdmin = require('firebase-admin'),
    { 'firebase-admin-sdk': firebase_admin_sdk } = require('../../config/secrets'),
    logger = require('../winston'),
    { logging } = require('../../config/default.json')

if (!firebase_admin_sdk[process.env.NODE_ENV] || !firebase_admin_sdk[process.env.NODE_ENV].sdk || !firebase_admin_sdk[process.env.NODE_ENV].databaseURL) {
    return logger.error('Service [Firebase Admin]: SDK or Database URL Missing')
}

try {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebase_admin_sdk[process.env.NODE_ENV].sdk),
        databaseURL: firebase_admin_sdk[process.env.NODE_ENV].databaseURL
    });
    logging.firebaseAdmin ? logger.info('Service [Firebase Admin]: SUCCESS') : null;
} catch {
    return logger.info('Service [Firebase Admin]: Failed. SDK or database URL Invalid')
}