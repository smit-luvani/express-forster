// App Entry Point
const express = require('express'),
    app = express(),
    httpStatus = require('http-status'),
    logger = require('./src/services/winston'),
    packageInfo = require('./package.json'),
    response = require('./src/helpers/response.helpers'),
    { randomDigit } = require('./src/utils/random')
const { ignoreLogPaths, healthCheckPaths } = require('./src/config/default');
const { hideSensitiveValue } = require('./src/utils');

process.on('uncaughtException', (error) => logger.error(error?.stack || error?.message || error));
process.on('unhandledrejection', (error) => logger.error(error?.stack || error?.message || error));

app.set('trust proxy', true)
app.set('x-powered-by', false)

// CORS 
app.use(require('cors')())

// Set Request ID and Time
app.use((req, res, next) => {
    // Attach Logger to Request and Response Object
    const time = new Date(), requestId = `REQ-${randomDigit()}`;

    const reqLogger = logger.__instance({ defaultMeta: { requestId: requestId, requestTime: time } })

    req.requestId = res.requestId = requestId;
    req.requestTime = res.requestTime = new Date();
    req.logger = res.logger = reqLogger;

    return next()
})

// Body Parser
app.use('/stripe/webhook', express.raw({ type: 'application/json' })); // To keep body raw for Stripe Webhook

app.use(express.urlencoded({ extended: true }), express.json(), (error, _, res, next) => {
    if (error instanceof SyntaxError) {
        return response(res, httpStatus.BAD_REQUEST, 'SyntaxError: Invalid Body')
    }
    if (error instanceof ReferenceError) {
        return response(res, httpStatus.BAD_REQUEST, 'ReferenceError: Invalid Reference. [REPORT TO DEVELOPER]')
    }

    return next()
})

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
        if (ignoreLogPaths.includes(req.path) || healthCheckPaths.includes(req.path)) {
            req.logger.silent = res.logger.silent = true;
        }

        var headers = hideSensitiveValue(req.headers),
            body = req.body ? hideSensitiveValue(req.body) : {},
            query = hideSensitiveValue(req.query),
            cookies = hideSensitiveValue(req.cookies);

        if (req.body instanceof Buffer) {
            body = '<Buffer>';
        }

        const headerLog = '' || `\nHeaders: ${JSON.stringify(headers)}`;
        const cookieLog = Object.keys(req.cookies).length > 0 ? `\nCookies: ${JSON.stringify(cookies)}` : '';
        const queryLog = Object.keys(req.query).length > 0 ? `\nQuery: ${JSON.stringify(query)}` : '';
        let bodyLog = req.body ? `\nBody: ${JSON.stringify(body)}` : '';

        if (bodyLog.length > 1000) bodyLog = `\nBody: Body too long to log. [${bodyLog.length} characters]`

        req.logger.info(`======================= REQUEST ============================= 
IP: ${(headers['x-forwarded-for'] || req.socket.remoteAddress).split(",")[0]}
Path: ${req.path} | Method: ${req.method} ${headerLog} ${cookieLog} ${queryLog} ${bodyLog}
==============================================================`)

        next();
    } catch (error) {
        return response(res, httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Request Logger Error', error)
    }
})

// App Health Check
app.get(healthCheckPaths, (req, res) => response(res, httpStatus.OK, 'Health: OK', {
    env: process.env.NODE_ENV,
    message: 'Health: OK',
    app: packageInfo.name,
    version: packageInfo.version,
    author: packageInfo.author,
    homepage: packageInfo.homepage,
}))

const routes = require('./src/routes');
app.use(routes);

app.use((req, res) => { return response(res, httpStatus.NOT_FOUND, 'The request route does not exist or the method might be different.', { path: req.originalUrl, method: req.method }) })

module.exports = app;