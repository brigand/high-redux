/* eslint-disable */
const jsToMdDocs = require('./jsToMdDocs');
const fs = require('fs');
const glob = require('glob');

const mdFiles = (() => {
  const files = glob.sync('src/pages/**/*.md');
  const filter = process.argv.slice(2).find(x => x && x[0] !== '-');

  if (filter) {
    return files.filter(x => x.includes(filter));
  }

  return files;
})();

function getRegex() {
  return {
    prefixRegex: /<!-- BEGIN_GENERATED ?([^]*?) -->/g,
    suffixRegex: /<!-- END_GENERATED ?([^]*?) -->/g,
  }
}

function getMatches(content, regex) {
  let match = null;
  const res = [];
  while (match = regex.exec(content)) {
    res.push({
      start: match.index,
      end: match.index + match[0].length,
      whole: match[0],
      firstGroup: match[1],
    });
  }
  return res;
}

// Splits the file into matched chunks. The result of this can be modified
// and passed into joinSplits to produce a modified file
function splitFile(content) {
  const allOut = [];
  const { prefixRegex, suffixRegex } = getRegex();
  const prefixMatches = getMatches(content, prefixRegex);
  const suffixMatches = getMatches(content, suffixRegex);

  const out = [];
  let index = 0;
  if (prefixMatches.length !== suffixMatches.length) {
    throw new Error(`Got ${prefixMatches.length} prefix comments, and ${suffixMatches.length} suffix matches. Expected to be equal.`);
  }
  let lastEnd = 0;
  for (let i = 0; i < prefixMatches.length; i += 1) {
    const pm = prefixMatches[i];
    const sm = suffixMatches[i];

    out.push({ type: 'text', value: (i === 0 ? '' : '\n') + content.slice(lastEnd, pm.end) + '\n' });
    out.push({
      type: 'gen',
      value: content.slice(pm.end, sm.start),
      params: pm.firstGroup,
    });

    lastEnd = sm.start;
  }

  out.push({ type: 'text', value: '\n' + content.slice(lastEnd) });
  return out;
}

// Takes the output of splitFile (possibly modified) and produces a single string
function joinSplits(things) {
  let str = '';
  for (const { type, value, content } of things) {
    str += value;
  }
  return str;
}

function getTrailingCode(md) {
  const lines = md.split('\n');
  const outLines = [];
  let started = false;
  for (let i = lines.length - 1; i > 0; i -= 1) {
    const line = lines[i];

    if (!started && /^```/.test(line)) {
      started = true;
      continue;
    }

    if (!started) continue;

    if (/<!--/.test(line)) continue;

    if (/^```/.test(line)) break;

    outLines.unshift(line);
  }

  return outLines.join('\n');
}

function evalTrailingCode(md) {
  const ownCode = getTrailingCode(md);
  const lib = fs.readFileSync('temp/umd.js', 'utf-8');

  const mod = {};
  const exp = {};
  mod.exports = exp;
  (new Function('module', 'exports', lib))(mod, exp);

  const hr = mod.exports;

  const outputRaw = [];
  function print(x) {
    outputRaw.push(x);
  }

  const prefixCode = `
    const runReducer = function (reducer, action) {
      let state = reducer(undefined, { type: 'REDUX:INIT' });
      state = reducer(state, action);
      return state;
    };
  `;

  const codeToRun = [prefixCode, ownCode].join('\n\n');

  (new Function('hr', 'print', codeToRun))(hr, print);

  return outputRaw.map(x => JSON.stringify(x, null, 2)).join('\n\n');
}

function processParts(parts) {
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    const { type, params } = part;
    if (type === 'text') continue;

    const words = params.split(/\s+/g);

    if (words[0] === 'CLASS') {
      const className = words[1];
      const sourceFile = fs.readFileSync(`temp/${className}.js`, 'utf-8');
      const mdInsert = jsToMdDocs(sourceFile);
      part.value = mdInsert;
    }
    if (words[0] === 'FROM_CODE_ABOVE') {
      part.value = wrapInCode(evalTrailingCode(parts[i - 1].value));
    }

    function wrapInCode(code) {
      return '```javascript\n' + code + '\n```';
    }

    if (words[0] === 'TYPE') {
      const type = words[1];
      const types = fs.readFileSync('temp/types.js', 'utf-8');

      const lines = types.split('\n');
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const regex = new RegExp(String.raw`export type ${type}\b`);
        if (regex.test(line)) {
          if (/;$/.test(line)) {
            part.value = wrapInCode(line.replace(/^export /g, ''));
            break;
          }

          // multiline
          let j = i;
          for (; j < lines.length; j += 1) {
            const line2 = lines[j];
            if (line2[0] === '}') {
              part.value = wrapInCode(lines.slice(i, j + 1).join('\n'));
              break;
            }
          }
          break;
        }
      }
    }

    part.value = `\n${part.value.trim()}\n`;
  }
  return parts;
}

const outputs = [];

for (const fileName of mdFiles) {
  const content = fs.readFileSync(fileName, 'utf-8');
  const parts = processParts(splitFile(content));
  const out = joinSplits(parts);

  outputs.push({ fileName, content: out.trim() + '\n' });
}

for (const output of outputs) {
  if (process.argv.includes('--write')) {
    console.error(`>>>> Writing ${output.fileName}`);
    fs.writeFileSync(output.fileName, output.content);
  } else {
    console.error(`>>>> ${output.fileName}`);
    console.log(output.content);
  }
}
