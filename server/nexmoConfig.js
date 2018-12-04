const Nexmo = require('nexmo');
const keys = require('./keys');

const nexmo = new Nexmo({
  apiKey: keys.nexmoApiKey,
  apiSecret: keys.nexmoApiSecret
});

module.exports = nexmo;