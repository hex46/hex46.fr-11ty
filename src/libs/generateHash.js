/**
 * src: 
 * - https://florian.ec/blog/cache-busting-eleventy-postcss/
 * - https://melvingeorge.me/blog/create-md5-hash-nodejs#full-solution
 */
const crypto = require('crypto');

const cacheMap = new Map(); // Cache

function generateHash(key, rawfile) {
    checkParameters(key, rawfile);

    // Cache
    let hash = cacheMap.get(key);
    if (hash) return hash;

    hash = getHash(rawfile);
    cacheMap.set(key, hash);

    return hash;
}

function checkParameters(key, rawfile) {
    if (!key || !rawfile)
        throw new Error('Error: some parameters are empty');

    if(key.length === 0 || rawfile.length === 0 )
        throw new Error('Error: some parameters are blank');
}

function getHash(rawfile) {
    const hmacResult = crypto.createHmac('md5', ''); // secret 
    const hash = hmacResult.update(rawfile);
    return hash.digest('hex');
}

module.exports = generateHash;