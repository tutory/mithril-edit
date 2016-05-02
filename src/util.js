
function identity (thing) {
  return thing
}

function isString (thing) {
  return Object.prototype.toString.call(thing) === '[object String]'
}

function isNumber (thing) {
  return typeof thing === 'number'
}

function isStringOrNumber (thing) {
  return isString(thing) || isNumber(thing)
}

function isArray (thing) {
  return Object.prototype.toString.call(thing) === '[object Array]'
}

function isFuction (thing) {
  return typeof thing === 'function'
}

module.exports = { identity, isString, isNumber, isStringOrNumber, isArray, isFuction }
