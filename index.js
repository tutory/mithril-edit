const m = require('mithril')
const domHelper = require('./src/dom-helper')
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
  return fragment.content
}

module.exports = {
  controller: function (options) {
    var caretPos
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

    scope.onChange = function (event) {
      caretPos = domHelper.getCaretCharacterOffsetWithin(event.target)
      var fragmentIndex = Array.from(scope.editorEl().childNodes).indexOf(window.getSelection().focusNode)
      var selection = window.getSelection()
      var offset = scope.fragments[fragmentIndex].start
      scope.selection = [offset + selection.anchorOffset, offset + selection.focusOffset]
      console.log(caretPos)
    }

    function render () {
      scope.fragments = applyFormattings(options.content.text, options.content.formattings)
    }
    render()

    return scope
  },
  view: function (scope) {
    return m('.editor', [
      m('button', { onclick: scope.makeBold }, 'bold'),
      m('button', { onclick: scope.makeItalic }, 'italic'),
      m('[contenteditable]', {
        config: scope.editorEl,
        onmouseup: scope.onChange,
        onkeyup: scope.onChange,
        oninput: scope.onChange
      }, scope.fragments.map(getContent))
    ])
  }
}
