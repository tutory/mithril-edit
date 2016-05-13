
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

function isFunction (thing) {
  return typeof thing === 'function'
}

function parse (fragment) {
  if (isArray(fragment)) {
    return { type: 'array', content: fragment.map(parse) }
  }
  if (isString(fragment)) {
    return { type: 'string', content: fragment }
  }
  if (fragment.content) {
    fragment.content = parse(fragment.content)
  }
  return fragment
}

module.exports = { identity, isString, isNumber, isStringOrNumber, isArray, isFunction, parse }
