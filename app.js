const express = require('express'),
    app = express(),
    httpStatus = require('http-status')

const packageInfo = require('./package.json')

// Console Clear
console.clear() // Comment this for Continuos logging

const logger = require('./src/services/winston')
logger.info(`Server: \x1b[32m\x1b[1m PORT: ${(process.env.PORT || 80)} \x1b[0m || \x1b[32m\x1b[1m NODE_ENV: ${process.env.NODE_ENV||'\x1b[31m\x1b[1m NODE_ENV NOT FOUND'} \x1b[0m `)

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

// App Health Check
app.use(['/', '/health'], (req, res) => {
    return res.status(httpStatus.OK).json({
        message: "Health: Ok",
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

module.exports = app;