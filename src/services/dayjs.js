/**
 * @description DayJS for date-time operations. It export single instance of DayJS with extended plugins.
 * @module https://www.npmjs.com/package/dayjs
 * @tutorial https://day.js.org/docs/en/installation/installation
 */
const DayJS = require('dayjs');
DayJS.extend(require('dayjs/plugin/customParseFormat'))
DayJS.extend(require('dayjs/plugin/utc'))
DayJS.extend(require('dayjs/plugin/timezone'))
module.exports = DayJS;