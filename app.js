const express = require('express'),
    app = express(),
    httpStatus = require('http-status'),
    logger = require('./src/services/winston'),
    packageInfo = require('./package.json'),
    { responseHelper: response } = require('./src/helpers'),
    { randomDigit } = require('./src/utils/random')
const { IncomingMessage } = require('http')
const CORS = require('cors');
const { cors: corsConfig } = require('./src/config/default');
const { ignoreLogPaths, healthCheckPaths } = require('./src/config/default');
const { hideSensitiveValue } = require('./src/utils');

// Handle Uncaught Exception
process.on('uncaughtException', (error) => logger.error(error?.stack || error?.message || error));

// CORS - Cross Origin Resource Sharing
app.use(CORS(corsConfig));

// Set Request ID and Time
app.use((req, res, next) => {
    IncomingMessage.prototype.requestId = 'REQ-' + randomDigit();
    IncomingMessage.prototype.requestTime = new Date();
    next()
})

// Body Parser
app.use(express.urlencoded({ extended: true }), express.json(), (error, _, res, next) => {
    if (error instanceof SyntaxError) {
        return response(res, httpStatus.BAD_REQUEST, 'SyntaxError: Invalid Body')
    }
    if (error instanceof ReferenceError) {
        return response(res, httpStatus.BAD_REQUEST, 'ReferenceError: Invalid Reference. [REPORT TO DEVELOPER]')
    }
    next()
})

// Multipart form data parser. Remove this , If you want to use multer
// const multipartParser = require('express-fileupload')
// app.use(multipartParser())

// Cookie Parser
app.use(require('cookie-parser')())

app.use((req, res, next) => {
    // URI Error Handling
    try {
        decodeURIComponent(req.path);
    } catch (error) {
        return response(res, httpStatus.BAD_REQUEST, 'URIError: Invalid URI/ URL. URI/ URL may contain invalid character.' + error.message || '', error)
    }

    try {
        // Log Incoming Request
        ignoreLogPaths.includes(req.path) || healthCheckPaths.includes(req.path) ? logger.silent = true : logger.silent = false;

        var headers = hideSensitiveValue(req.headers),
            body = req.body ? hideSensitiveValue(req.body) : {},
            query = hideSensitiveValue(req.query),
            cookies = hideSensitiveValue(req.cookies);

        const headerLog = '' || `\nHeaders: ${JSON.stringify(headers)}`;
        const cookieLog = Object.keys(req.cookies).length > 0 ? `\nCookies: ${JSON.stringify(cookies)}` : '';
        const queryLog = Object.keys(req.query).length > 0 ? `\nQuery: ${JSON.stringify(query)}` : '';
        const bodyLog = req.body ? `\nBody: ${JSON.stringify(body)}` : '';

        logger.info(`======================= REQUEST ============================= 
IP: ${(headers['x-forwarded-for'] || req.socket.remoteAddress).split(",")[0]}
Path: ${req.path} | Method: ${req.method} ${headerLog} ${cookieLog} ${queryLog} ${bodyLog}
==============================================================`)

        next();
    } catch (error) {
        return response(res, httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Request Logger Error', error)
    }
})

// To Use Service from All Services
// const { bcryptjs } = require('./src/services') // Go To file for Enable/Disable Service

// To Use Particular Service
// const jwt = require('./src/services/jwt')

// App Health Check
app.get(healthCheckPaths, (req, res) => response(res, httpStatus.OK, 'Health: OK', {
    message: 'Health: OK',
    app: packageInfo.name,
    version: packageInfo.version,
    description: packageInfo.description,
    author: packageInfo.author,
    license: packageInfo.license,
    homepage: packageInfo.homepage,
    repository: packageInfo.repository,
    contributors: packageInfo.contributors
}, '#ExpressForsterHealthCheck', { project: 'Express-Forster', health_check_paths: healthCheckPaths }))

// Import Routes
const routes = require('./src/routes');
app.use(routes);

app.use((req, res) => { return response(res, httpStatus.NOT_FOUND, 'The request route does not exist or the method might be different.') })

module.exports = app;