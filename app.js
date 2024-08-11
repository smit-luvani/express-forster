// App Entry Point
const express = require('express'),
    app = express(),
    httpStatus = require('http-status'),
    logger = require('./src/services/winston'),
    packageInfo = require('./package.json'),
    response = require('./src/helpers/response.helpers'),
    { randomDigit } = require('./src/utils/random')
const { healthCheckPaths } = require('./src/config/default');
const { hideSensitiveValue } = require('./src/utils');
const DayJS = require('./src/services/dayjs');
const serverUpTime = new Date();

app.set('trust proxy', true)
app.set('x-powered-by', false)

// CORS 
app.use(require('cors')())

// Set Request ID and Time
app.use((req, res, next) => {
    // Attach Logger to Request and Response Object
    const requestId = `REQ-${randomDigit()}`;

    req.requestId = res.requestId = requestId;
    req.requestTime = res.requestTime = new Date();

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

        logger.info(`======================= REQUEST ============================= 
IP: ${(headers['x-forwarded-for'] || req.socket.remoteAddress).split(",")[0]}
Path: ${req.path} | Method: ${req.method} ${headerLog} ${cookieLog} ${queryLog} ${bodyLog}
==============================================================`)

        next();
    } catch (error) {
        return response(res, httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Request Logger Error', error)
    }
})

// App Health Check
app.get(healthCheckPaths, (req, res) => {
    return response(res, httpStatus.OK, 'Health: OK', {
        app: packageInfo.name,
        version: packageInfo.version,
        environment: process.env.NODE_ENV,
        author: packageInfo.author,
        contributors: packageInfo.contributors,
        time_info: {
            timezone: DayJS.tz.guess(),
            server_uptime: { Date: serverUpTime, locale_string: DayJS(serverUpTime).format('LLLL'), uptime_info: DayJS(serverUpTime).fromNow(), uptime_seconds: parseInt((new Date() - serverUpTime) / 1000) },
            server_time: { Date: new Date(), locale_string: DayJS().format('LLLL') },
        },
    });
});

const routes = require('./src/routes');
app.use(routes);

app.use((req, res) => { return response(res, httpStatus.NOT_FOUND, 'The request route does not exist or the method might be different.', { path: req.originalUrl, method: req.method }) })

module.exports = app;