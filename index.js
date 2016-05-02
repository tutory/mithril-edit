const m = require('mithril')
const fragmentTypes = require('./src/fragment-types')
const util = require('./src/util')

module.exports = {
  controller: function (options) {
    var stringFragments
    var scope = {
      fragments: parse(options.content),
      makeBold: addFormatting('bold'),
      makeItalic: addFormatting('italic')
    }

    function render () {
      stringFragments = []
      scope.output = renderFragment(scope.fragments)
    }

    function addFormatting (type) {
      return function (event) {
        const selection = document.getSelection()
        const fragment = getSelectedFragement(selection)
        fragment.type = 'array'
        delete fragment.el
        const start = Math.min(selection.anchorOffset, selection.focusOffset)
        const end = Math.max(selection.anchorOffset, selection.focusOffset)
        fragment.content = [
          { type: 'string', content: fragment.content.substring(0, start) },
          {
            type: type,
            content: { type: 'string', content: fragment.content.substring(start, end) }
          },
          { type: 'string', content: fragment.content.substring(end) }
        ]
        render()
      }
    }

    function parse (fragment) {
      if (util.isArray(fragment)) {
        return { type: 'array', content: fragment.map(parse) }
      }
      if (util.isString(fragment)) {
        return { type: 'string', content: fragment }
      }
      if (fragment.content) {
        fragment.content = parse(fragment.content)
      }
      return fragment
    }

    function getSelectedFragement (selection) {
      const el = selection.focusNode.parentNode
      return stringFragments.find(fragment => fragment.el === el)
    }

    scope._show = function (fragment) {
      return fragmentTypes[fragment.type].render(fragment, scope._show)
    }

    function renderFragment (fragment) {
      var node = fragmentTypes[fragment.type].render(fragment, renderFragment)
      if (fragment.type === 'string') {
        stringFragments.push(fragment)
        node.attrs.config = function (el) {
          fragment.el = el
        }
      }
      return node
    }

    render()

    scope.onInput = function (event) {
      const selection = document.getSelection()
      const el = selection.focusNode.parentNode
      getSelectedFragement(selection).content = el.innerHTML
      render()
    }

    return scope
  },
  view: function (scope) {
    return m('.editor', [
      m('button', { onclick: scope.makeBold }, 'bold'),
      m('button', { onclick: scope.makeItalic }, 'italic'),
      m('#editor[contenteditable]', {
        oninput: scope.onInput
      }, scope.output),
      m('#viewer', { style: 'background: green', key: 'view' }, scope._show(scope.fragments))
    ])
  }
}
