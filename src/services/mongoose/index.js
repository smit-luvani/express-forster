/**
 * @author Smit Luvani
 * @description Export Mongoose Schema Module with Configuration and MongoDB Connection
 * @module https://www.npmjs.com/package/mongoose
 * @tutorial https://mongoosejs.com/docs/guide.html
 */

const mongoose = require('mongoose'),
    logger = require('../winston'),
    { logging } = require('../../config/default.js')

try {
    mongoose.connect(process.env.MONGO_DB_SRV, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: true
    })

    mongoose.connection.on('error', (error) => (logger.error('Service [Mongoose]: ' + error), process.exit(1)))
    logging.mongoose ? mongoose.connection.once('open', () => logger.info(`Service [Mongoose]: Connected to {${process.env.NODE_ENV}} environment`)) : null;
} catch (error) {
    logger.error('Service [Mongoose]: ' + error)
    process.exit(1);
}