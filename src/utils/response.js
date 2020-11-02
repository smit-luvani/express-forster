const logger = require("../services/winston")

module.exports = (res, status, message, data, customCode) => {
    // res = response object

    if (!res) {
        return logger.error('Response Object is require to send response')
    }

    if (!status || isNaN(parseInt)) {
        return logger.error('Valid Status Code is required')
    }

    return res.status(parseInt(status)).json({ status, message, data, customCode })
}