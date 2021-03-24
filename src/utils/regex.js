/**
 * @author Smit Luvani, Jenil Narola
 * @description Validate Value with Regex
 */

const { winston: logger } = require('../services'),
    unirest = require('unirest')

module.exports.email = async(value, checkDisposable) => {
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (value != "") {
        if (!value.match(regex)) {
            logger.error('Incorrect Email Value. Not match with regex');
            return false;
        }
    } else {
        logger.error('Incorrect Email Value. Value not Found');
        return false;
    }

    if (checkDisposable) {
        let { body } = await unirest.get('https://open.kickbox.com/v1/disposable/' + value);

        if (body.disposable) {
            logger.error('Disposable Email found');
            return false;
        }

    }

    return true; // If Pass the Validation

}

module.exports.mobile = (value) => {
    if (String(value).length != 10) {
        logger.error(`Mobile Length more than 10. Value: ${String(value)} and length: ${String(value).length}`)
        return false;
    }

    return true;
}