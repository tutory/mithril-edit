const m = require('mithril')
const domHelper = require('./src/dom-helper')
const stringHelper = require('./src/string-helper')
const transforms = require('./src/transforms')

function getFragment (text, start, end, formatting) {
  return {
    start: start,
    end: end,
    content: text.substring(start, end),
    formatting: formatting
  }
}

function applyFormattings (text, formattings) {
  var result = []
  var lastPos = formattings.reduce(function (pos, formatting) {
    result = result.concat([
      getFragment(text, pos, formatting.start),
      getFragment(text, formatting.start, formatting.end, formatting)
    ])
    return formatting.end
  }, 0)
  return result.concat(getFragment(text, lastPos))
}

function getContent (fragment) {
  if (fragment.formatting) {
    return transforms[fragment.formatting.type].render(fragment.content, fragment.formatting)
  }
  return m('span', fragment.content)
}

var i = 0

function fragmentView (scope) {
  return function (fragment) {
    var content = getContent(fragment)
    content.attrs.config = function (el) {
      fragment.domEl = el
      if (fragment.start < scope.caretPos && fragment.end > scope.caretPos) {
        domHelper.setCaretPos(el, scope.caretPos - fragment.start)
      }
    }
    return content
  }
}

module.exports = {
  controller: function (options) {
    function addFormatting (type) {
      return function () {
        options.content.formattings.push({
          start: scope.selection[0], end: scope.selection[1], type: type
        })
        options.content.formattings.sort((a, b) => a.start > b.start)
        render()
      }
    }

    var scope = {
      editorEl: m.prop(),
      makeBold: addFormatting('bold'),
      makeItalic: addFormatting('italic')
    }

    scope.onKeyDown = function (event) {
      scope.caretPos = domHelper.getCaretCharacterOffsetWithin(event.currentTarget)
    }

    scope.onKeyPress = function (event) {
      event.preventDefault()
      var input = String.fromCharCode(event.keyCode)
      if (input) {
        options.content.text = stringHelper.insertIntoString(options.content.text, input, scope.caretPos)
        scope.caretPos++
      }
      render()
    }

    scope.onChange = function (event) {
      scope.caretPos = domHelper.getCaretCharacterOffsetWithin(event.currentTarget)
      var fragmentIndex = Array.from(scope.editorEl().childNodes).indexOf(window.getSelection().focusNode)
      if (fragmentIndex >= 0) {
        var selection = window.getSelection()
        var offset = scope.fragments[fragmentIndex].start
        scope.selection = [offset + selection.anchorOffset, offset + selection.focusOffset]
      }
    }

    function render () {
      i++
      scope.fragments = applyFormattings(options.content.text, options.content.formattings)
    }
    render()

    return scope
  },
  view: function (scope) {
    return m('.editor', [
      m('button', { onclick: scope.makeBold }, 'bold'),
      m('button', { onclick: scope.makeItalic }, 'italic'),
      m('#editor[contenteditable]', {
        key: 'editor',
        config: scope.editorEl,
        onkeypress: scope.onKeyPress,
        onkeydown: scope.onKeyDown,
        onmouseup: scope.onChange
      }, scope.fragments.map(fragmentView(scope))),
      m('.foo', m('#state', {
        style: { background: 'silver' },
        key: i
      }, scope.fragments.map(getContent)))
    ])
  }
}
