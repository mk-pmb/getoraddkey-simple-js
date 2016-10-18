/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var goak = require('getoraddkey-simple'), assert = require('assert'),
  fruitColors = {};

goak(fruitColors, [ 'stone', 'cherry' ], '[]').push('black', 'red');

assert.deepStrictEqual(fruitColors, {
  stone: {
    cherry: [ 'black', 'red' ]
  }
});









console.log("+OK fruit test passed.");    //= "+OK fruit test passed."
