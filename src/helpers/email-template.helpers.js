const fs = require('fs')
const { logger } = require('../services')
const templateDirectory = process.cwd() + '/src/templates/emails'

const templates = {
    // 'TEMPLATE_NAME': `${templateDirectory}/TEMPLATE_NAME.html`, // Example. You can add more templates here.
}

/**
 * @author Smit Luvani
 * @description Replace Email Template with Data. This function will replace all the keys in template with data. Please use {{key}} in template to replace with data.
 * @param {String} templateName
 * @param {object} data
 */
async function generateBody(templateName, data = {}) {
    logger.info('Helpers > Email Template Helpers')

    if (!templateName || !data || typeof templateName !== 'string' || typeof data !== 'object') {
        throw new Error('templateName is required. templateName must be string and Data must be JSON.');
    }

    let templateCode = String(templateName).toUpperCase().trim()

    if (!templates[templateCode] && !await fs.existsSync(templateName)) {
        logger.error(`[HELPER > EMAIL]: Template ${templates[templateCode] || templateName} not found.`)
        throw new Error(`Template ${templates[templateCode] || templateName} not found.`);
    }

    let fileContent;
    try {
        fileContent = await fs.readFileSync(templates[templateCode] || templateName, 'utf-8')

        // Replace JSON key with value in fileContent
        for (let key in data) {
            if (typeof data[key] != 'undefined') {
                fileContent = fileContent.replace(new RegExp(`{{${key}}}`, 'g'), data[key])
            }
        }

        // Missing keys
        const findKeys = new RegExp(/{{(.*?)}}/, 'g'); // Starts with {{ and ends with }}
        var missingKeys = findKeys.exec(fileContent);

        if (!missingKeys) {
            return fileContent;
        }

        var missingKeysArray = new Set();
        while (missingKeys !== null) {
            missingKeysArray.add(missingKeys[1]);
            missingKeys = findKeys.exec(fileContent);
        }

        throw new Error(`[HELPER > EMAIL]: Missing keys in template ${templateName}. Missing values for ${Array.from(missingKeysArray).map(k => `'${k}'`).join(', ')}`);
    } catch (error) {
        throw new Error('[HELPER > EMAIL]: File Reading Error. ' + error.message);
    }
}

generateBody.templates = templates;

module.exports = generateBody;