/**
 * src: 
 * - https://florian.ec/blog/cache-busting-eleventy-postcss/
 * - https://melvingeorge.me/blog/create-md5-hash-nodejs#full-solution
 */
const crypto = require('crypto');

module.exports = function generateHash(rawfile) {
    checkParameters(rawfile);
    return getHash(rawfile);
}

function checkParameters(rawfile) {
    if (!rawfile)
        throw new Error('Error: some parameters are empty');

    if(rawfile.length === 0 )
        throw new Error('Error: some parameters are blank');
}

function getHash(rawfile) {
    const hmacResult = crypto.createHmac('md5', ''); // secret 
    const hash = hmacResult.update(rawfile);
    return hash.digest('hex');
}