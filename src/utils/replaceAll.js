/**
 * @author Smit Luvani
 * @description Replace All Matching String by Given String
 * @param {String} string - String to replace
 * @param {String} replace - Word or String or Character want to replace
 * @param {String} withString - New Word/String/Character
 * @param {default:true}
 */

module.exports = (string, replace, withString, { globalMatch, ignoreCase }) => {

    if (!string || !replace || !withString) {
        return '[replaceAll]: Missing Parameter';
    }

    let matchOption = 'g';

    globalMatch == false ? matchOption.replace('g', '') : null;
    ignoreCase == true ? matchOption += 'i' : null;

    let regex = new RegExp(`\\b${replace}\\b`, matchOption)
    return String(string).replace(regex, withString)
}