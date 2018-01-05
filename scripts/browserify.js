const fs = require('fs');
const bify = require('browserify');

const b = bify('./lib/HighRedux.js', {
  standalone: 'HighRedux',
});
// b.external('react');
// b.external('react-redux');

b.bundle()
  .pipe(fs.createWriteStream('./lib/umd.js'));

