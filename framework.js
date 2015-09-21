/* eslint-env node, es6 */
"use strict";
const format = require("util").format;
const YAML = require('yamljs');

const language = 'de-DE';
module.exports.t = t;

const translation = YAML.load('src/translations_' + language + '.yml');

console.log(translation);

function t(token, count, ...rest) {
  const formatStrings = (count !== undefined) ? [count].concat(rest) : rest;
  const translated    = (count !== undefined) ? pluralize(translate(token), count) : translate(token);
  return format(translated, ...formatStrings);
}

function translate(token) {
  const parts = [language].concat(token.split('.'));
  const translated = parts.reduce((search, part) => search && search[part], translation);
  return translated || token;
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