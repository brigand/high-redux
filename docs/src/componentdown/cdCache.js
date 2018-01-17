const crypto = require('crypto');
const cache = {};

exports.hash = (data) => {
  const hash = crypto.createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
};

exports.get = (key) => {
  return cache[key];
};

exports.getOrCreate = (key, factory) => {
  if (!cache[key]) {
    cache[key] = factory();
  }

  return cache[key];
};

exports.cache = cache;
