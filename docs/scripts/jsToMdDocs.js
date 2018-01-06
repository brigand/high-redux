/* eslint-disable */
const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;

function parse(code) {
  const res = babylon.parse(code, {
    sourceType: 'module',
    plugins: ['flow', 'objectRestSpread', 'jsx'],
  });

  return res;
}

function countSpaces(str) {
  let i;
  for (i = 0; i < str.length; i += 1) {
    if (!/\s/.test(str[i])) break;
  }
  return i;
}

function cleanComment(comment) {
  const lines = comment.split('\n');
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.includes('*/')) continue;
    if (!/\S/.test(line)) continue;
    const leading = countSpaces(line);
    if (leading !== 0 && leading < minIndent) minIndent = leading;
  }

  if (minIndent === Infinity) minIndent = 0;

  const out = [];
  for (const line of lines) {
    let trimmed = line;
    if (line[0] === ' ') {
      trimmed = line.slice(minIndent);
    }
    out.push(trimmed);
  }
  return out.join('\n');
}

function extractInfoMethod(node) {
  const commentRaw = node.leadingComments && node.leadingComments[0] && node.leadingComments[0].value;
  const comment = commentRaw ? cleanComment(commentRaw) : null;

  const name = node.key.name;

  const params = node.params;

  let paramRange = null;

  if (node.params.length) {
    const paramsStart = node.params[0].start;
    const paramsEnd = node.params[node.params.length - 1].end;
    paramRange = [paramsStart, paramsEnd];
  }

  return {
    name,
    comment,
    paramRange,
  };
}

function extractInfo(ast) {
  const results = [];
  traverse(ast, {
    enter(path) {
      if (path.node.type === 'ClassBody') {
        const className = path.parentPath.node.id.name;
        for (const node of path.node.body) {
          if (node.type === 'ClassMethod') {
            const res = extractInfoMethod(node);
            res.className = className;
            if (res) results.push(res);
          }
        }
      }
    },
  });
  return results;
}

function makeMd(info, code) {
  const allOut = [];
  for (const method of info) {
    let out = ``;

    out += `### \`${method.className}::${method.name}\`\n\n`;

    let params = '';
    if (method.paramRange) {
      params = code.slice(method.paramRange[0], method.paramRange[1]);;
    }

    if (method.name === 'constructor') {
      out += `Signature: \`new ${method.className}(${params})\`\n\n`;
    } else {
      out += `Signature: \`.${method.name}(${params})\`\n\n`;
    }

    if (method.comment) {
      out += `${method.comment.trim()}\n\n`;
    }

    allOut.push(out);
  }

  return allOut.join('\n\n');
}

function jsToMdDocs(code) {
  const ast = parse(code);
  const info = extractInfo(ast)
  return makeMd(info, code);
}

if (require.main === module) {
  const content = fs.readFileSync(process.argv[2], 'utf-8');
  const md = jsToMdDocs(content);
  console.log(md);
} else {
  module.exports = jsToMdDocs;
}
