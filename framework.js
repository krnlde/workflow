/* eslint-env node, es6 */
"use strict";
const format = require("util").format;
module.exports.sayHelloTo = function sayHelloTo(name) {
  let ret = ''
  for (let i = 20; i--;) ret += '<li>Hello <em>' + name + '</em>!</li>'
  return ret
}


const translation = {
  'sheeps': '%d sheep(s)'
}

module.exports.t = function t(token, count, ...rest) {
  const formatStrings = count !== undefined ? [count].concat(rest) : rest;
  let template = translate(token);
  if (count !== undefined) template = pluralize(template);
  return format(translated, formatStrings);
  return token;
}

function translate(token) {
  return translation[token];
}

function pluralize(text, count) {
  const parts = text.match(/(.+?)\((.+?)\)/)
  const plural = parts ? parts[2] : ''
  const singular = plural.split('|')[0] == plural ? parts[1] : plural.split('|')[0]
  console.log({parts, plural, singular});
}