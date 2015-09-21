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
  let translated = translate(token);
  if (count !== undefined) translated = pluralize(translated, count);
  return format(translated, formatStrings);
}

function translate(token) {
  return translation[token];
}

function pluralize(text, count) {
  return text.replace(/\((.+?)\)/g, (substring, match) => {
    const split = match.split('|');
    if (split.length > 1) {
      return (count == 1) ? split[0] : split[1];
    }
    if (count != 1) return split[0];
    return '';
  });
}