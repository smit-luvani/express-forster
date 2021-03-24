/**
 * @author Smit Luvani
 * @description Time Validation
 */

const logger = require("../services/winston")

module.exports.minuteHour = (value) => {

    if (value) {
        let [hour, minute] = String(value).split(':')

        // Hour Validation
        if (isNaN(parseInt(hour)) || hour.length != 2 || hour < 0 || hour > 23) {

        }

        // Minute Validation
        if (isNaN(parseInt(minute)) || minute.length != 2 || minute < 0 || minute >= 60) {
            logger.error(`Time ${hour}:${minute} is invalid. Hour and Minutes must be integer value`);
            return false;
        }

        return `${parseInt(hour)}:${parseInt(minute)}`;
    }
    return false;
}

module.exports.secondMinuteHour = (value) => {

    if (value) {
        let [hour, minute, second] = String(value).split(':')

        // Hour Validation
        if (isNaN(parseInt(hour)) || hour.length != 2 || hour < 0 || hour > 23) {

        }

        // Minute Validation
        if (isNaN(parseInt(minute)) || minute.length != 2 || minute < 0 || minute >= 60) {
            logger.error(`Time ${hour}:${minute}:${second} is invalid. Hour, Minute and Second must be integer value`);
            return false;
        }

        // Second Validation

        if (isNaN(parseInt(second)) || second.length != 2 || second < 0 || second >= 60) {
            logger.error(`Time ${hour}:${minute}:${second} is invalid. Hour, Minute and Second must be integer value`);
            return false;
        }

        return `${parseInt(hour)}:${parseInt(minute)}:${parseInt(second)}`;
    }
    return false;
}