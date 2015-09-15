/* eslint-env node, es6 */
"use strict";
function sayHelloTo(name) {
  let ret = ''
  for (let i = 20; i--;) ret += '<li>Jo <em>' + name + '</em>!</li>'
  return ret
}

module.exports.sayHelloTo = sayHelloTo