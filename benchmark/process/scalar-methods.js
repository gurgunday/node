'use strict';

const common = require('../common.js');
const assert = require('assert');

const bench = common.createBenchmark(main, {
  method: [
    'uptime',
    'constrainedMemory',
    'availableMemory',
  ],
  n: [1e6],
});

function main({ n, method }) {
  const fn = process[method];
  let value = 0;

  bench.start();
  for (let i = 0; i < n; i++) {
    value += fn();
  }
  bench.end(n);

  assert.strictEqual(typeof value, 'number');
}
