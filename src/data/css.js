const SCSSBuild = require('../scss/scss.11ty');

const scssBuildInstance = new SCSSBuild();
const permalink = scssBuildInstance.data().permalink;

module.exports = {
    permalink: permalink
}