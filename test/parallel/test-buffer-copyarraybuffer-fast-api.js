// Flags: --expose-internals --no-warnings --allow-natives-syntax
'use strict';

const common = require('../common');
const assert = require('assert');
const { internalBinding } = require('internal/test/binding');

const binding = internalBinding('buffer');

const src = new ArrayBuffer(16);
const dst = new ArrayBuffer(16);
const srcView = new Uint8Array(src);
for (let i = 0; i < srcView.length; i++) srcView[i] = i;

function callCopy() {
  return binding.copyArrayBuffer(dst, 0, src, 0, src.byteLength);
}

eval('%PrepareFunctionForOptimization(callCopy)');
callCopy();
eval('%OptimizeFunctionOnNextCall(callCopy)');
callCopy();

assert.deepStrictEqual(new Uint8Array(dst), new Uint8Array(src));

if (common.isDebug) {
  const { getV8FastApiCallCount } = internalBinding('debug');
  assert.strictEqual(getV8FastApiCallCount('buffer.copyArrayBuffer'), 1);
}
