/**
 * @description This file is used to connect with redis server
 */

const redis = require('redis');
const logger = require('../winston')

const RedisClient = redis.createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
// RedisClient.connect();

RedisClient.on('connect', () => logger.info('Service [Redis]: Connected'));
RedisClient.on('error', (err) => console.error(err));

module.exports = RedisClient;

