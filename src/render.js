const fragmentTypes = require('./fragment-types')

module.exports = function render (state) {
  return function (fragment) {
    var node = fragmentTypes[fragment.type].render(fragment, render(state))
    node.attrs = node.attrs || {}
    node.attrs.oncreate = node.attrs.onupdate = function (v) {
      if (node.tag === '#' || node.text) {
        state.textFragments.push(fragment)
      }
      fragment.el = v.dom
    }
    return node
  }
}

module.exports.readOnly = function renderReadOnly (fragment) {
  return fragmentTypes[fragment.type].render(fragment, renderReadOnly)
}
