/**
 * @author Smit Luvani, Jenil Narola
 * @description Validate Value with Regex
 */

const { winston: logger } = require('../services'),
    unirest = require('unirest')

module.exports.email = async (value, checkDisposable) => {
    let regex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    if (value != "") {
        if (!value.match(regex) || value.match(regex)[0] != value) {
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