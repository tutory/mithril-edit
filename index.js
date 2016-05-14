const m = require('mithril/render/hyperscript')
const util = require('./src/util')
const fragmentHandler = require('./src/fragments')
const render = require('./src/render')

module.exports = {
  oninit: function (v) {
    v.state.textFragments = fragmentHandler()
    v.state.doc = util.parse(v.attrs.content)
    v.state.makeBold = addFormatting('bold')
    v.state.makeItalic = addFormatting('italic')
    var currentSelection = {
      fragment: null,
      start: null,
      end: null
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
      }
    }

    function getSelectedFragement (selection) {
      return v.state.textFragments.byEl(selection.focusNode)
    }

    v.state.onInput = function (event) {
      const selection = document.getSelection()
      const el = selection.focusNode
      getSelectedFragement(selection).content = el.textContent
    }

    return v.state
  },

  view: function (v) {
    return m('.editor', [
      m('button', { onclick: v.state.makeBold }, 'bold'),
      m('button', { onclick: v.state.makeItalic }, 'italic'),
      m('#editor[contenteditable]', {
        oninput: v.state.onInput
      }, render(v.state)(v.state.doc)),
      m('#view', render.readOnly(v.state.doc))
    ])
  }
}
