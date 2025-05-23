﻿/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


var EX, hasOwn = Function.call.bind(Object.prototype.hasOwnProperty),
  arSlc = Array.prototype.slice;


EX = function getOrAddKey(dict, key, receipe) {
  /* Note to future self: If you're sad that arguments are in the opposite
     order of what would be useful for .bind()ing, remember .preset(). */

  if (!dict) { return false; }
  if ((key && typeof key) === 'object') {
    dict = EX.dive(dict, key, 1, function (rmn) { key = rmn[0]; });
  }
  if (hasOwn(dict, key)) { return dict[key]; }
  return EX.setProp(dict, key, EX.make(receipe, dict, key));
};


EX.dive = function dive(dict, path, keepCnt, withKept) {
  if (!dict) { return false; }
  if (!Number.isFinite(path.length)) { return dict; }
  var idx, len = path.length, steps = len - (+keepCnt || 0), step, kept = [];
  for (idx = 0; idx < len; idx += 1) {
    step = path[idx];
    if (idx < steps) {
      if (!hasOwn(dict, step)) { dict[step] = {}; }
      dict = dict[step];
    } else {
      kept[kept.length] = step;
    }
  }
  if (withKept) { withKept(kept); }
  return dict;
};


EX.setProp = function setProp(obj, prop, value) {
  obj[prop] = value;
  return value;
};


EX.dynArg = function dynArg(kwargs) {
  var slot = kwargs.dyn;
  kwargs = Object.assign(Object.create(null), kwargs);
  if (!kwargs.receipe) { kwargs.receipe = '{null}'; }
  return function (arg) {
    kwargs[slot] = arg;
    return EX(kwargs.dict, kwargs.key, kwargs.receipe);
  };
};


EX.pushToKey = function pushToKey(dict, key, values) {
  var arr;
  values = arSlc.call(arguments, 2);
  if ((typeof dict) === 'string') {
    // swap args "key" and "dict"
    arr = key;
    key = dict;
    dict = arr;
  }
  arr = EX(dict, key, '[]');
  arr.push.apply(arr, values);
  return arr;
};


function makeObjectReceipe(rec) {
  if (Array.isArray(rec)) {
    if (rec.length === 1) { return rec[0]; }
    throw new Error('Array recipe must have exactly one item');
  }
  var keys = Object.keys(rec);
  if ((keys.length === 1) && (keys[0] === 'value')) { return rec.value; }
  keys = ('Object recipe must have exactly one property "value", '
    + 'not ' + keys.length + ' ' + JSON.stringify(keys));
  throw new Error(keys);
}


EX.make = function make(receipe) {
  switch (receipe && typeof receipe) {
  case 'string':
    switch (receipe) {
    case 'ocn':
    case '{null}':
      return Object.create(null);
    case 'array':
    case '[]':
      return [];
    case 'obj':
    case '{}':
      return {};
    case 'undef':
      return undefined;
    }
    return JSON.parse(receipe);
  case 'function':
    return receipe.apply(null, arSlc.call(arguments, 1));
  case 'object':
    return makeObjectReceipe(receipe);
  }
  throw new Error('Unsupported receipe type: ' + String(receipe));
};


EX.preset = function preset(recipe, preKey) {
  if (preKey === undefined) {
    return function presetGetOrAddKey(k, d) { return EX(d, k, recipe); };
  }
  return function presetGetOrAddKey(d) { return EX(d, preKey, recipe); };
};































module.exports = EX;
