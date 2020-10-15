const http = require('http');
const port = process.env.PORT || 80;
const listenerAPP = require('./app');
http.createServer(listenerAPP).listen(port)