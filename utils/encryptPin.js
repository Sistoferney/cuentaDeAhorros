const crypto = require('crypto');

function encryptPin(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

module.exports = encryptPin;