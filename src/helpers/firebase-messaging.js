const FCM = require('firebase-admin/messaging');
const logger = require('../services/winston');

/**
 * It is a helper function to send push notification to the user
 * @tutorial https://firebase.google.com/docs/cloud-messaging/send-message
 * @typedef {{data: Object, token: String, notification: Object, condition: string, android: Object, apns: Object, webpush: Object, topic: String  }} NotificationObject
 * @param {NotificationObject|[NotificationObject]} data - Data to send in notification
 * @param {Function} cb - Callback function
 */
const send = (data, cb = () => { }) => new Promise((resolve, reject) => {
    if (!data) return cb('Data is required', null);

    if (!Array.isArray(data)) data = [data];

    FCM.getMessaging().sendEach(data).then(result => {
        cb(null, result)
        resolve(result);
    }).catch(error => {
        logger.error(error);
        cb(error, null);
        reject(error);
    });
})

// TODO: Send Multicast Message

module.exports = {
    send
}