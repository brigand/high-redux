const path = require('path');
const fs = require('fs');
const cache = require('./cdCache');
const { Parser } = require('htmlparser2');
const { parse } = require('babylon');
const { default: traverse } = require('babel-traverse');
const { transform, types } = require('babel-core');
const matter = require('gray-matter');
const utils = require('./cdUtils');

const DATA_VAR = 'data';

function getConfig() {
  return require(path.resolve(`src/componentdown.config.js`));
}

function cdLoader(content) {
  const q = this.query.slice(1);
  const [templateResolve, hash] = q.split(',');
  const { resourcePath } = this;

  // Grab the frontmatter for convenience. If the user specifies it in their
  // data object, it'll override this. Accessable as data.frontmatter.whatever
  // inside the JSX
  const { data: frontmatter } = matter(content);

  if (!q) {
    throw new Error(`componentdown loader expected a query string with the cache hash of the file`);
  }


  // This contains data the JSX elements may use. It's 'potential' because
  // we won't inject the data unless they actually reference it.
  const potentialData = Object.assign({ frontmatter }, cache.get(hash));

  // This will be injected into the resulting JS. Contains the metadata used
  // by the JSX elements in the markdown.
  const resDataObj = {};

  const { html } = potentialData;
  if (!html) {
    throw new Error(`Expected html to be passed to cd-loader (usually getCdResolve's 3rd argument must be { html: str })`);
  }

  if (!html) {
    throw new Error(`componentdown loader couldn't find the html in the cache`);
  }

  const items = [];

  let lastIndex = 0;
  let itemIndex = 0;

  const importLines = [];
  const constLines = [];

  // This will be the loader output. Will be flattened at the end
  const lines = [`/* @jsx h */;`, importLines, '', constLines, ''];

  importLines.push(`import { createElement as h2 } from 'react';`);
  lines.push(`var h = h2`);

  const cleanHtml = (html) => {
    return utils.fixLinks(html)
      .replace(/<--/g, '')
      .replace(/-->/g, '')
      .trim();
  };

  const didImport = new Map();

  const parser = new Parser({
    oncomment(content) {
      const start = html.indexOf(content, lastIndex);
      const end = html.indexOf(`-->`, start);

      items.push({ type: 'raw', key: `raw${itemIndex}`, content: cleanHtml(html.slice(lastIndex, start)) });

      lastIndex = end;

      const maybeJsx = content.trim();

      if (maybeJsx[0] === '<' && /[<>]$/.test(maybeJsx)) {
        items.push({ type: 'jsx', key: `jsx${itemIndex}`, content: maybeJsx });

        const ast = parse(maybeJsx, {
          plugins: ['jsx', 'doExpressions', 'objectRestSpread', 'dynamicImport'],
        });

        traverse(ast, {
          enter(path) {
            if (path.node.type === 'JSXOpeningElement') {
              const name = path.node.name.name;

              if (name && /^[A-Z]/.test(name)) {
                const resolve = getConfig().components[name];

                if (!resolve) {
                  throw new Error(`Failed to find component '${name}' in componentdown.config.js. e.g. module.exports = {components: {Foo: require.resolve('./src/Foo')}}`);
                }

                if (!didImport.has(name)) {
                  importLines.push(`import ${name} from ${JSON.stringify(resolve)}`);
                  didImport.set(name, true);
                }
              }

              const undefs = utils.getUndefAccess(path);
              for (const undef of undefs) {
                if (undef.root === DATA_VAR) {
                  utils.copyFromPath(resDataObj, potentialData, undef.keys);
                }
              }
            }
          },
        });
      } else {
        items.push({ type: 'raw', key: `comment${itemIndex}`, content: `<!-- ${maybeJsx} -->` });
      }
      itemIndex += 1;
    }
  });

  parser.write(html);
  parser.end();

  lines.push(`var data = ${JSON.stringify(resDataObj)};`);

  const lastItem = items[items.length - 1] || { end: 0 };
  items.push({ type: 'raw', key: `raw${lastIndex}`, content: html.slice(lastItem.end) });

  if (templateResolve) {
    importLines.push(`import Tpl from ${JSON.stringify(templateResolve)};`);
  }

  for (const item of items) {
    let line = `var ${item.key} = `;
    if (item.type === 'raw') {
      const str = JSON.stringify(item.content);
      line += `h('span', { key: '${item.key}', dangerouslySetInnerHTML: { __html: ${str} } });`;
    } else if (item.type === 'jsx') {
      line += `${item.content}`;
    }
    lines.push(line);
  }

  const componentName = resourcePath
    // get filename
    .split(/[\/\\]/g)
    .pop()
    .split('.')
    .shift()
    // make it a valid identifier; PascalCase
    .replace(/[-_]([a-zA-Z])/g, (m, letter) => letter.toUpperCase())
    .replace(/[^a-zA-Z]+/g, '')
    .replace(/^./, m => m.toUpperCase());

  // Define and export the component
  lines.push(``);
  lines.push(`export default function CD${componentName}(props) {`);
  lines.push(`  return (`);
  if (templateResolve) {
    lines.push(`    <Tpl {...props}>`);
  } else {
    lines.push(`    <div>`);
  }

  // Insert the content
  for (const item of items) {
    lines.push(`      {${item.key}}`);
  }

  // Close the stuff off
  if (templateResolve) {
    lines.push(`    </Tpl>`);
  } else {
    lines.push(`    </div>`);
  }
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);

  // Flatten and join
  const output = lines.reduce((xs, ys) => xs.concat(ys), []).join('\n');
  const { code: outputEs5 } = transform(output, {
    babelrc: false,
    presets: ['react', 'latest'],
  });

  return outputEs5;
}

module.exports = cdLoader;
