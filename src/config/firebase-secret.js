const SDK = {
    development: {
        databaseURL: null,
        sdk: null
    },
    production: {}
}
/**
 * @param {string} key Specify the environment or key that you want to get
 * @returns {{databaseURL: string, sdk: object}} SDK
 */
module.exports = (key) => SDK[key || process.env.NODE_ENV]