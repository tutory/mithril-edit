const m = require('mithril/render/hyperscript')
const fragmentTypes = require('./src/fragment-types')
const util = require('./src/util')

module.exports = {
  oninit: function (v) {
    var textFragments
    v.state.fragments = util.parse(v.attrs.content)
    v.state.makeBold = addFormatting('bold')
    v.state.makeItalic = addFormatting('italic')
    var currentSelection = {
      fragment: null,
      start: null,
      end: null
    }

    function render () {
      textFragments = []
      v.state.output = renderFragment(v.state.fragments)
    }

    function addFormatting (type) {
      return function (event) {
        const selection = document.getSelection()
        const fragment = getSelectedFragement(selection)
        fragment.type = 'array'
        delete fragment.el
        const start = Math.min(selection.anchorOffset, selection.focusOffset)
        const end = Math.max(selection.anchorOffset, selection.focusOffset)
        const formatedFragment = {
          type: type,
          content: { type: 'string', content: fragment.content.substring(start, end) }
        }
        fragment.content = [
          { type: 'string', content: fragment.content.substring(0, start) },
          formatedFragment,
          { type: 'string', content: fragment.content.substring(end) }
        ]
        currentSelection.fragment = formatedFragment
        currentSelection.start = 0
        currentSelection.end = end - start
        render()
      }
    }

    function getSelectedFragement (selection) {
      const el = selection.focusNode
      const selectedFragment = textFragments.find(fragment => fragment.el === el)
      if (!selectedFragment) {
        throw new Error('no selected fragment found')
      }
      return selectedFragment
    }

    v.state._show = function (fragment) {
      return fragmentTypes[fragment.type].render(fragment, v.state._show)
    }

    function renderFragment (fragment) {
      var node = fragmentTypes[fragment.type].render(fragment, renderFragment)
      node.attrs = node.attrs || {}
      node.attrs.oncreate = node.attrs.onupdate = function (v) {
        if (fragment === currentSelection.fragment) {
          var selection = document.getSelection()
          var range = document.createRange()
          range.selectNodeContents(v.dom)
          selection.removeAllRanges()
          selection.addRange(range)
          currentSelection = { fragment: null }
        }
        if (node.tag === '#' || node.text) {
          textFragments.push(fragment)
        }
        fragment.el = v.dom
      }
      return node
    }

    render()

    v.state.onInput = function (event) {
      const selection = document.getSelection()
      const el = selection.focusNode
      getSelectedFragement(selection).content = el.textContent
      render()
    }

    return v.state
  },
  view: function (v) {
    return m('.editor', [
      m('button', { onclick: v.state.makeBold }, 'bold'),
      m('button', { onclick: v.state.makeItalic }, 'italic'),
      m('#editor[contenteditable]', {
        oninput: v.state.onInput
      }, v.state.output),
      m('#viewer', { style: 'background: green', key: 'view' }, v.state._show(v.state.fragments))
    ])
  }
}
