/**
 * @author Smit Luvani
 * @description Check An Array's Items includes in Another Array
 */

module.exports = (new_array, original_array) => {

    let flag = true; // Initial consider as True

    new_array.forEach(data => {
        // If New Array Item does not match with items of Original Array
        !original_array.includes(data) ? flag = false : null;
    })

    return flag;
}