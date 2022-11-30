/**
 * @author Smit Luvani
 * @description Export Mongoose Schema Module with Configuration and MongoDB Connection
 * @module https://www.npmjs.com/package/mongoose
 * @tutorial https://mongoosejs.com/docs/guide.html
 */

const mongoose = require('mongoose'),
    { mongoose: mongoose_srv } = require('../../config/secrets'),
    logger = require('../winston'),
    { logging } = require('../../config/default.json')

if (!process.env.MONGO_DB_SRV) {
    logger.error('Secrets [Mongoose]: srv not found')
    process.exit(1);
}

try {
    mongoose.connect(process.env.MONGO_DB_SRV, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: true
    }, (error) => {
        if (error) {
            logger.error('Service [Mongoose]: ', error)
            process.exit(1);
        } else
            logging.mongoose ? logger.info('Service [Mongoose]: Connected') : null;
    })
} catch (error) {
    logger.error('Service [Mongoose]: ' + error)
    process.exit(1);
}