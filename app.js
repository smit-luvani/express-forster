const express = require('express'),
    app = express(),
    httpStatus = require('http-status'),
    logger = require('./src/services/winston'),
    packageInfo = require('./package.json'),
    response = require('./src/utils/response'),
    { randomDigit } = require('./src/utils/random')

// Console Clear
console.clear() // Comment this for Continuos logging

// Environment Checker
app.use(require('./src/services/NODE_ENV'));
logger.info(`Server: \x1b[32m\x1b[1m PORT: ${process.env.PORT || 80} \x1b[0m || \x1b[32m\x1b[1m NODE_ENV: ${process.env.NODE_ENV || '\x1b[31m\x1b[1m NODE_ENV NOT FOUND'} \x1b[0m`)

// Body Parser
app.use(express.urlencoded({ extended: true }), express.json(), (error, req, res, next) => {
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

// URI Error Handling
app.use((req, res, next) => {
    try {
        decodeURIComponent(req.path);
        next();
    } catch (error) {
        return response(res, httpStatus.BAD_REQUEST, 'URIError: Invalid URI/ URL. URI/ URL may contain invalid character.' + error.message || '', error)
    }
})

// Request Logger
app.use((req, res, next) => {
    try {
        // Track Individual Request
        let requestID = randomDigit();
        res._requestID = requestID;
        res._requestTime = new Date();

        logger.debug(`
        Request: 
        Request ID: ${res._requestID} | IP: ${(req.headers[ 'x-forwarded-for' ] || req.socket.remoteAddress).split(",")[0]}
        Path: ${req.path} | Method: ${req.method}
        header: ${JSON.stringify(req.headers)}
        Body: ${JSON.stringify(req.body)}
        Query: ${JSON.stringify(req.query)}
        Cookie: ${JSON.stringify(req.cookies)}
        `)

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
app.get(['/', '/health'], (req, res) => {
    return res.status(httpStatus.OK).json({
        message: 'Health: OK',
        app: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,
        author: packageInfo.author,
        license: packageInfo.license,
        homepage: packageInfo.homepage,
        repository: packageInfo.repository,
        contributors: packageInfo.contributors
    });
})

app.use((req, res) => { return response(res, httpStatus.METHOD_NOT_ALLOWED, 'Invalid API/Method. Please check HTTP Method.') })

module.exports = app;