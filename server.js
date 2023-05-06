console.clear() // Comment this for Continuos logging

// Load Environment Variables from the .env file
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV || 'development'}`, override: true })

if (!process.env.NODE_ENV || !process.env.PORT) throw new Error('NODE_ENV or PORT not found in .env file. Please configure .env file. See README.md')

const logger = require('./src/services/winston');
const packageJson = require('./package.json');
const expressApp = require('./app');
const http = require('http');

// HTTP Server
const server = http.createServer(expressApp);
server.addListener('listening', () => {
    logger.info(`[Server.js]: \x1b[96m\x1b[1m PROJECT: ${packageJson.name} \x1b[0m | \x1b[32m\x1b[1m PORT: ${process.env.PORT} \x1b[0m | \x1b[32m\x1b[1m NODE_ENV: ${process.env.NODE_ENV || '\x1b[31m\x1b[1m NODE_ENV NOT FOUND'} \x1b[0m`)
});

server.listen(process.env.PORT); // Start Server on PORT