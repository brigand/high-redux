const cache = require('./cdCache');
const cdLoader = require.resolve(`./cdLoader`);

function getCdResolve(templateResolve, fileAbsolutePath, data) {
  let prefix = `!!${cdLoader}`;
  const suffix = `!${fileAbsolutePath}`;

  const hashValue = JSON.stringify({ fileAbsolutePath, data });
  const hash = cache.hash(hashValue);
  cache.getOrCreate(hash, () => data);
  const resolve = `${prefix}?${templateResolve || ''},${hash}${suffix}`;

  return resolve;
}

module.exports = getCdResolve;
