const getCdResolve = require('../getCdResolve');
const cdLoader = require.resolve(`../cdLoader`)

it(`works with no comments`, () => {
  const html = `<div>test</div>`;
  const resolve = getCdResolve(`tpl`, `file.md`, html);

  const query = `tpl,80eefc05e6589be2c13a208d4f90699ef539fad6`;

  expect(resolve).toBe(`!!${cdLoader}?${query}!file.md`);
});
