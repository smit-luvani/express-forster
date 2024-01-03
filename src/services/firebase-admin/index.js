/**
 * @author Smit Luvani
 * @description Set Firebase Admin SDK
 * @module https://www.npmjs.com/package/firebase-admin
 * @tutorial https://www.npmjs.com/package/firebase-admin#documentation
 */
const logger = require('../winston');
const { initializeApp, applicationDefault } = require('firebase-admin/app');

try {
    const app = initializeApp({
        credential: applicationDefault()
    })

    logger.info('Service [Firebase Admin]: App Initialized ' + app.name)
} catch (e) {
    console.error(e)
    logger.error('Service [Firebase Admin]: ', e?.stack || e?.message)
}