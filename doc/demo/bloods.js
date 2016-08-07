/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var goak = require('getoraddkey-simple'), people, categ, namesByLength,
  D = require('lib-demo-util-160404')();

people = [
  { name: 'Anna',     age: 13,  blood: 'A', },
  { name: 'Frank',    age: 78,  blood: '0', },
  { name: 'Chris',    age: 28,  blood: 'B', },
  { name: 'Dana',     age: 31,  blood: 'AB', },
  { name: 'Ben',      age: 44,  blood: 'B', },
  { name: 'Eric',     age: 35,  blood: 'A', },
];

categ = {};
namesByLength = {};

people.forEach(function (person) {
  var grp = goak(categ, person.blood, '{"names":[],"ageSum":0}');
  grp.names.push(person.name);
  grp.ageSum += person.age;
  goak.pushToKey(namesByLength, person.name.length, person.name);
});

D.result = D.sorted.keys(categ);
D.expect('like', ["0", "A", "AB", "B"]);

D.result = D.sorted.map(categ, function (blood) {
  var grp = categ[blood], avgAge = grp.ageSum / grp.names.length;
  return (blood + ':' + grp.names.join(',')
    + ' ' + D.ent.oslash + avgAge);
});
D.expect('like', ["0:Frank ø78", "A:Anna,Eric ø24",
  "AB:Dana ø31", "B:Chris,Ben ø36"]);

D.result = D.sorted.map(namesByLength, function (len, names) {
  return (len + ':' + names.join(','));
});
D.expect('like', ["3:Ben", "4:Anna,Dana,Eric", "5:Frank,Chris"]);











D.ok(module);     //= "+OK all bloods tests passed."
