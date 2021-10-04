process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 80;
const listenerAPP = require('./app');
listenerAPP.listen(port)