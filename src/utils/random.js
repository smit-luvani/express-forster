/**
 * @author Smit Luvani
 * @description Creates Random Values 
 */

module.exports.randomDigit = (minimum, maximum) => {

    // Validate Value
    minimum ? minimum = parseInt(Number(minimum)) : undefined;
    maximum ? maximum = parseInt(Number(maximum)) : undefined;

    if (minimum != undefined && isNaN(minimum)) {
        throw 'randomDigit: Invalid minimum value'
    }
    if (maximum != undefined && isNaN(maximum)) {
        throw 'randomDigit: Invalid maximum value'
    }

    // Generate random number for given length
    if (minimum != undefined && maximum == undefined) {
        let length = minimum;
        return Math.floor(Math.random() * (9 * Math.pow(10, length - 1))) + Math.pow(10, length - 1);
    }


    // Generate random number between minimum and maximum value
    if (minimum != undefined && maximum != undefined) {
        return (Math.round((Math.random() * (maximum - minimum) + minimum)))
    }

    return Math.floor(new Date().valueOf() * Math.random())
}

module.exports.randomString = (length) => {

    if (!length) {
        length = this.randomDigit(5);
    }

    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}