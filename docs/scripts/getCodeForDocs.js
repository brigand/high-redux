#!/usr/bin/env node

// Gets the code either locally or from a git remote
// Currently only local is allowed

const fs = require('fs');
const path = require('path');

const files = [
  { name: `HrStateWrapper.js`, dir: `src`},
  { name: `HrQuery.js`, dir: `src`},
  { name: `types.js`, dir: `src`},
  { name: `umd.js`, dir: `lib`},
];

async function getCode(_target) {
  let target = _target;

  if (!target) target = `..`;

  if (target[0] === '.' || target[0] === '/') {
    // eslint-disable-next-line
    for (const { name, dir} of files) {
      const loc = path.join(target, dir, name);
      const str = fs.readFileSync(loc, 'utf-8');
      const outLoc = `temp/${name}`;
      // eslint-disable-next-line
      console.error(`copying ${loc} to ${outLoc}`);
      fs.writeFileSync(outLoc, str);
    }
  } else {
    throw new Error(`Invalid target "${target}"`);
  }
}

async function run() {
  try {
    const target = process.argv[2];
    await getCode(target);
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
    process.exit(7);
  }
}

if (require.main === module) {
  run();
} else {
  module.exports = getCode;
}
