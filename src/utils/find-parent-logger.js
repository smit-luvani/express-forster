const DefaultLogger = require("../services/winston");
const WinstonLogger = require('winston').Logger

/**
 * @author Smit Luvani
 * @description It will find the logger instance from the all parent function until it finds the first logger instance
 * @returns {WinstonLogger}
 * 
 * This function has snippet with deprecated `arguments.callee` which is not recommended to use.
 * - If you're using this in strict mode, it will not work as expected. In such case, it is recommended to use with logger argument as below:
 * - loggerFinder(your_logger_instance) at any place and all subsequent functions should have logger as argument and pass it to next function
 * - Make sure strict mode is not enabled in the file where you're using this function
 * @see https://stackoverflow.com/a/235760/10753768
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments/callee
 * 
 * However, currently it will handle the error and return the default logger instance. So, it is safe to use.
 */
function loggerFinder(...Args) {
    try {
        // Current function arguments
        if (Args.length > 0) {
            for (let i = 0; i < Args.length; i++) {
                if (Args[i] instanceof WinstonLogger) {
                    return Args[i]
                } else if (typeof Args[i] === 'object' && Args[i]?.logger instanceof WinstonLogger) {
                    // Check if the object has logger instance. It is possible when logger is passed in request or response object
                    return Args[i].logger
                }
            }
        }
    } catch { }

    try {
        let fnCallee = arguments.callee;

        while (fnCallee) {
            // Check all arguments of the callee
            if (fnCallee.arguments.length > 0) {
                for (let i = 0; i < fnCallee.arguments.length; i++) {
                    if (fnCallee.arguments[i] instanceof WinstonLogger) {
                        return fnCallee.arguments[i]
                    }

                    if (typeof fnCallee.arguments[i] === 'object' && fnCallee.arguments[i]?.logger instanceof WinstonLogger) {
                        // Check if the object has logger instance. It is possible when logger is passed in request or response object
                        return fnCallee.arguments[i].logger
                    }
                }
            }
            fnCallee = fnCallee.caller;
        }
        return DefaultLogger;
    } catch (error) {
        // logger.error('[loggerFinder]', error)
        return DefaultLogger;
    }
}

module.exports = loggerFinder;