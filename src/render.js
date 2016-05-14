const fragmentTypes = require('./fragment-types')

module.exports = function render (state) {
  return function (fragment) {
    if (fragment.removed) {
      return
    }
    var node = fragmentTypes[fragment.type].render(fragment, render(state))
    if (node.tag === '#') {
      state.textFragments.push(fragment)
    }
    node.attrs = node.attrs || {}
    node.attrs.oncreate = function (v) {
      fragment.el = v.dom
    }
    return node
  }
}

module.exports.readOnly = function renderReadOnly (fragment) {
  if (fragment.removed) {
    return
  }
  return fragmentTypes[fragment.type].render(fragment, renderReadOnly)
}
