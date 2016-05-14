const m = require('mithril/render/hyperscript')
const util = require('./src/util')
const fragmentHandler = require('./src/fragments')
const render = require('./src/render')

module.exports = {
  oninit: function (v) {
    const textFragments = v.state.textFragments = fragmentHandler()
    v.state.doc = util.parse(v.attrs.content)
    v.state.makeBold = addFormatting('bold')
    v.state.makeItalic = addFormatting('italic')
    var currentSelection
    var previousSelection

    function cleanup (selection) {
      selection.selectedFragments.map(function (fragment) {
        if (!document.body.contains(fragment.el)) {
          fragment.removed = true
        }
      })
    }

    function addFormatting (type) {
      return function (event) {
        const selection = document.getSelection()
        const fragment = textFragments.byEl(selection.focusNode)
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
      }
    }

    v.state.onInput = function (event) {
      currentSelection.selectedFragments.map(function (fragment) {
        fragment.content = fragment.el.textContent
      })
      cleanup(previousSelection)
    }

    v.state.updateSelection = function (event) {
      previousSelection = currentSelection
      currentSelection = textFragments.selection(document.getSelection())
    }

    return v.state
  },

  view: function (v) {
    v.state.textFragments.reset()
    return m('.editor', [
      m('button', { onclick: v.state.makeBold }, 'bold'),
      m('button', { onclick: v.state.makeItalic }, 'italic'),
      m('#editor[contenteditable]', {
        onkeydown: v.state.updateSelection,
        onmousedown: v.state.updateSelection,
        oninput: v.state.onInput
      }, render(v.state)(v.state.doc)),
      m('#view', render.readOnly(v.state.doc))
    ])
  }
}
