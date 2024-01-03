/**
 * @author Smit Luvani
 * @description Export Mongoose Schema Module with Configuration and MongoDB Connection
 * @module https://www.npmjs.com/package/mongoose
 * @tutorial https://mongoosejs.com/docs/guide.html
 */

const mongoose = require('mongoose'),
    logger = require('../winston')
const fs = require('fs');

try {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_DB_SRV, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(({ connection }) => {
        logger.info(`Service [Mongoose]: Connected Database \x1b[32m\x1b[1m${connection?.name}\x1b[0m`);

        // Load all models
        fs.readdirSync(process.cwd() + '/src/database').forEach(function (file) {
            if (~file.indexOf('.js')) require(process.cwd() + '/src/database/' + file);
        });
    }, (error) => {
        console.error(error)
        logger.error('Service [Mongoose]: ' + error)
        process.exit(1)
    })
} catch (error) {
    console.error(error)
    logger.error('Service [Mongoose]: ' + error)
    process.exit(1);
}