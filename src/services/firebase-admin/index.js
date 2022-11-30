/**
 * @author Smit Luvani
 * @description Set Firebase Admin SDK
 * @module https://www.npmjs.com/package/firebase-admin
 * @tutorial https://www.npmjs.com/package/firebase-admin#documentation
 */

const firebaseAdmin = require('firebase-admin'),
    logger = require('../winston'),
    { logging } = require('../../config/default.json')

const serviceAccount = require('../../config/firebase-secret')();
if (!serviceAccount) {
    logger.error('Service [Firebase Admin]: SDK or Database URL Missing')
    process.exit(1);
}

try {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount.sdk),
        databaseURL: serviceAccount.databaseURL
    });
    logging.firebaseAdmin ? logger.info('Service [Firebase Admin]: SUCCESS') : null;
} catch {
    logger.info('Service [Firebase Admin]: Failed. SDK or database URL Invalid')
    process.exit(1);
}