// App Entry Point
const express = require('express'),
    app = express(),
    { httpStatus } = require('./src/services'),
    logger = require('./src/services/winston'),
    packageInfo = require('./package.json'),
    response = require('./src/helpers/response.helpers'),
    { randomDigit } = require('./src/utils/random')
const { healthCheckPaths } = require('./src/config/default');
const { hideSensitiveValue, getLoggerInstance } = require('./src/utils');
const DayJS = require('./src/services/dayjs');
const serverUpTime = DayJS().toDate();

app.set('trust proxy', true)
app.set('x-powered-by', false)

// CORS 
app.use(require('cors')())

// Set Request ID and Time
app.use((req, res, next) => {
    // Attach Logger to Request and Response Object
    const requestId = `REQ-${randomDigit()}`;

    req.requestId = res.requestId = requestId;
    req.requestTime = res.requestTime = DayJS().toDate();
    req.logger = res.logger = logger.__instance({ defaultMeta: { requestId: requestId, requestTime: req.requestTime } });

    return next()
})

// Body Parser
app.use('/stripe/webhook', express.raw({ type: 'application/json' })); // To keep body raw for Stripe Webhook

app.use(express.urlencoded({ extended: true }), express.json(), function (error, _, res, next) {
    const logger = getLoggerInstance(...arguments);

    if (error instanceof SyntaxError) {
        logger.error('SyntaxError: Invalid Body', error)
        return response(res, httpStatus.BAD_REQUEST, 'SyntaxError: Invalid Body')
    }

    if (error instanceof ReferenceError) {
        logger.error('ReferenceError: Invalid Reference. [REPORT TO DEVELOPER]', error)
        return response(res, httpStatus.BAD_REQUEST, 'ReferenceError: Invalid Reference. [REPORT TO DEVELOPER]')
    }

    return next()
})

// Cookie Parser
app.use(require('cookie-parser')())

app.use(function (req, res, next) {
    const logger = getLoggerInstance(...arguments);
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
app.get(healthCheckPaths, function (req, res) {
    const logger = getLoggerInstance(...arguments);
    logger.info('Health Check: OK');

    return response(res, httpStatus.OK, 'Health: OK', {
        app: packageInfo.name,
        version: packageInfo.version,
        environment: process.env.NODE_ENV,
        author: packageInfo.author,
        contributors: packageInfo.contributors,
        time_info: {
            timezone: DayJS.tz.guess(),
            server_uptime: {
                Date: serverUpTime,
                locale_string: DayJS(serverUpTime).format('LLLL'),
                uptime_info: DayJS(serverUpTime).fromNow(),
                uptime_seconds: DayJS().diff(serverUpTime, 'seconds', true)
            },
            server_time: { Date: DayJS().toDate(), locale_string: DayJS().format('LLLL') },
        },
    });
});

const routes = require('./src/routes');
app.use(routes);

app.use((req, res) => { return response(res, httpStatus.NOT_FOUND, 'The request route does not exist or the method might be different.', { path: req.originalUrl, method: req.method }) })

module.exports = app;