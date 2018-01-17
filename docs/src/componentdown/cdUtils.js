
const getUndefAccess = (inPath, callback) => {
  const undefs = [];

  inPath.traverse({
    enter(path) {
      // member expressions are nested, so skip direct nested expressions
      // but we don't path.skip() because we might have e.g. data.foo(data.bar)
      // where we'll match both data.foo and data.bar
      if (path.parentPath.isMemberExpression()) return;

      if (path.isMemberExpression()) {
        // Recurse over the items
        // the output format for data.foo.bar.baz is { keys: ['foo', 'bar', 'baz'], root: 'data' }
        const keys = [];
        let root = null;

        let curr = path;
        while (curr) {
          const prop = curr.get('property');
          const obj = curr.get('object');
          if (!prop.node) break;

          if (obj.get('name')) {
            root = obj.node.name;
          }
          keys.unshift(prop.node.name);
          curr = obj;
        }
        if (!path.scope.hasBinding(root)) {
          const result = { keys, root };
          undefs.push(result);

          if (callback) {
            callback(result, path);
          }
        }
        path.skip();
      }
    }
  });

  return undefs;
};

const copyFromPath = (target, source, keys) => {
  let targetTemp = target;
  let sourceTemp = source;
  for (const key of keys.slice(0, -1)) {
    if (!sourceTemp[key]) {
      const source = JSON.parse(JSON.stringify(source));
      if (source.html) {
        source.html = '<omitted>'
      }
      throw new Error(`Attempted to copy ${keys.join('.')} but doesn't exist in source object ${JSON.stringify(source, null, 2)}`);
    }

    targetTemp[key] = targetTemp[key] || {};
    targetTemp = targetTemp[key];
    sourceTemp = sourceTemp[key];
  }

  const last = keys[keys.length - 1];
  targetTemp[last] = sourceTemp[last];

  return target;
};

module.exports = {
  getUndefAccess,
  copyFromPath,
};
