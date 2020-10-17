const mongoose = require('mongoose'),
    { mongoose: mongoose_srv } = require('../../../config/secrets'),
    logger = require('../winston'),
    { logging } = require('../../../config/default.json')

if (!mongoose_srv[process.env.NODE_ENV].srv) {
    return logger.error('Secrets [Mongoose]: srv not found')
}

try {
    mongoose.connect(mongoose_srv[process.env.NODE_ENV].srv, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: true
    }, (error) => {
        if (error) {
            logger.error('Service [Mongoose]: ', error)
        } else
            logging.mongoose ? logger.info('Service [Mongoose]: Connected') : null;
    })
} catch (error) {
    logger.error('Service [Mongoose]: ' + error)
}