// Flags: --allow-natives-syntax --expose-internals --no-warnings
'use strict';

const common = require('../common');
const assert = require('assert');

const { internalBinding } = require('internal/test/binding');

function testFastProcessScalars() {
  assert.strictEqual(typeof process.uptime(), 'number');
  assert.strictEqual(typeof process.constrainedMemory(), 'number');
  assert.strictEqual(typeof process.availableMemory(), 'number');
}

eval('%PrepareFunctionForOptimization(testFastProcessScalars)');
testFastProcessScalars();
eval('%OptimizeFunctionOnNextCall(testFastProcessScalars)');
testFastProcessScalars();

if (common.isDebug) {
  const { getV8FastApiCallCount } = internalBinding('debug');
  assert.strictEqual(getV8FastApiCallCount('process.uptime'), 1);
  assert.strictEqual(getV8FastApiCallCount('process.constrainedMemory'), 1);
  assert.strictEqual(getV8FastApiCallCount('process.availableMemory'), 1);
}
