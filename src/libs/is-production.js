module.exports = function isProduction() {
    const environment = process.env.ELEVENTY_ENV;
    return environment === "prod";
}