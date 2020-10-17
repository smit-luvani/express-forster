const logger = require('../winston'),
    { logging } = require('../../../config/default.json');

// Environment
const NODE_ENV = String(process.env.NODE_ENV).trim() || 'development';

switch (NODE_ENV) {
    case 'development':
    case 'production':
        process.env.NODE_ENV = String(process.env.NODE_ENV).trim()
        logging.NODE_ENV ? logger.info('APP [ENVIRONMENT]: ' + NODE_ENV) : null;
        break;
    default:
        return logger.error('APP [ENVIRONMENT]: NODE_ENV is not valid. Use "development" or "production"')
}