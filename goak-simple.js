/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';


var EX, hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);

EX = function getOrAddKey(dict, key, receipe) {
  if (hasOwn(dict, key)) { return dict[key]; }
  return EX.setProp(dict, key, EX.make(receipe, dict, key));
};


EX.setProp = function (obj, prop, value) {
  obj[prop] = value;
  return value;
};


EX.dynArg = function (kwargs) {
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
  values = Array.prototype.slice.call(arguments, 2);
  if ((typeof dict) === 'string') {
    arr = key;
    key = dict;
    dict = arr;
  }
  arr = EX(dict, key, '[]');
  arr.push.apply(arr, values);
  return arr;
};


EX.make = function (receipe) {
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
    return receipe.apply(null, Array.prototype.slice.call(arguments, 1));
  case 'object':
    if (receipe instanceof Array) { return receipe[0]; }
    return receipe.value;
  }
  throw new Error('Unsupported receipe type: ' + String(receipe));
};































module.exports = EX;
