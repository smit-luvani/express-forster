const { ignoreLogPaths, healthCheckPaths } = require('./src/config/default');

const express = require('express'),
    app = express(),
    httpStatus = require('http-status'),
    logger = require('./src/services/winston'),
    packageInfo = require('./package.json'),
    response = require('./src/utils/response'),
    { randomDigit } = require('./src/utils/random')

// Attach Request ID to Response Object
app.use((_, res, next) => {
    res._requestID = randomDigit();
    res._requestTime = new Date();
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
        if (ignoreLogPaths.includes(req.path) || healthCheckPaths.includes(req.path)) logger.silent = true;

        var headers = { ...req.headers }, body = { ...req.body }, cookies = { ...req.cookies };

        logger.info(`
--------------- INCOMING REQUEST ---------------------------------------------
Request ID: ${res._requestID} | IP: ${(headers['x-forwarded-for'] || req.socket.remoteAddress).split(",")[0]}
Path: ${req.path} | Method: ${req.method}
Headers: ${JSON.stringify(headers)}
Body: ${JSON.stringify(body)}
Query: ${JSON.stringify(req.query)}
Cookies: ${JSON.stringify(cookies)}
------------------------------------------------------------------------------`)

        next();
    } catch (error) {
        return response(res, httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Request Logger Error', error)
    }
})

// To Use Service from All Services
// const { bcryptjs } = require('./src/services/index') // Go To file for Enable/Disable Service

// To Use Particular Service
// const jwt = require('./src/services/jwt')

// App Health Check
app.get(healthCheckPaths, (req, res) => {
    response(res, httpStatus.OK, 'Health: OK', {
        message: 'Health: OK',
        app: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,
        author: packageInfo.author,
        license: packageInfo.license,
        homepage: packageInfo.homepage,
        repository: packageInfo.repository,
        contributors: packageInfo.contributors
    })
})

app.use((req, res) => { return response(res, httpStatus.METHOD_NOT_ALLOWED, 'Invalid API/Method. Please check HTTP Method.') })

module.exports = app;