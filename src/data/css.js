const SCSSBuild = require('../scss/scss.11ty');

module.exports = async function() {
    const scssBuildInstance = new SCSSBuild();
    const data = scssBuildInstance.data();

    return data;  
}