'use strict';

const common = require('../common.js');

const bench = common.createBenchmark(main, {
  len: [64, 1024, 16384, 262144],
  offset: [0, 8],
  n: [5e5],
});

function main({ len, offset, n }) {
  const binding = common.binding('buffer');
  if (!binding || typeof binding.copyArrayBuffer !== 'function') {
    throw new Error('buffer.copyArrayBuffer fast API is not available');
  }

  // Inputs
  const src = new ArrayBuffer(len);
  const dst = new ArrayBuffer(len + offset + 16);

  // Fill the source so engines do actual work
  const srcView = new Uint8Array(src);
  for (let i = 0; i < srcView.length; i++) srcView[i] = i & 0xFF;

  const dstOffset = offset >>> 0;
  const srcOffset = 0 >>> 0;
  const length = len >>> 0;

  const copy = () => binding.copyArrayBuffer(dst, dstOffset, src, srcOffset, length);

  // Warmup to help JIT reach the fast path
  for (let i = 0; i < 1e3; i++) copy();

  bench.start();
  for (let i = 0; i < n; i++) copy();
  bench.end(n);
}
