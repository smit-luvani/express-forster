const express = require('express'),
    app = express(),
    httpStatus = require('http-status')

// Console Clear
console.clear() // Comment this for Continuos logging

logger = require('./src/services/winston')
logger.info('Server: Working on ' + (process.env.PORT || 80))

// Body Parser
const bodyParser = require('body-parser'),
    multipartParser = require('express-fileupload')

app.use(bodyParser.urlencoded({ extended: false }), bodyParser.json(), (error, req, res, next) => {
    if (error instanceof SyntaxError) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'SyntaxError: Invalid Body' })
    }
    if (error instanceof ReferenceError) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'ReferenceError: Invalid Reference. [REPORT TO DEVELOPER]' })
    }
    next()
})

app.use(multipartParser())

// URI Error Handling
app.use((req, res, next) => {
    try {
        decodeURIComponent(req.path);
        next();
    } catch {
        return res.status(400).json({ status: 400, response: 'badContent', message: 'URIError: Invalid URI/ URL. URI/ URL may contain invalid character.' })
    }
})

// Enable Service
// const { bcryptjs } = require('./src/services/index') // Go To file for Enable/Disable Service

// Enable Particular Service
const jwt = require('./src/services/jwt')