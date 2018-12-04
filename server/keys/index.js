const prodKeys = require('./keysProd');
const devKeys = require('./keysDev');

const keys = process.env.NODE_ENV === 'development' ? devKeys : prodKeys;

module.exports = keys;