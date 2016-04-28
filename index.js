const m = require('mithril')
const domHelper = require('./src/dom-helper')
const transforms = require('./src/transforms')

function snippet (text, start, end, format) {
  return {
    start: start,
    end: end,
    content: text.substring(start, end),
    format: format
  }
}

function applyFomat (content) {
  var result = []
  var lastPos = content.formats.reduce(function (pos, format) {
    result = result.concat([
      snippet(content.text, pos, format.start),
      snippet(content.text, format.start, format.end, format)
    ])
    return format.end
  }, 0)
  return result.concat(snippet(content.text, lastPos))
}

function content (snippet) {
  if (snippet.format) {
    return transforms[snippet.format.type].render(snippet.content, snippet.format)
  }
  return snippet.content
}

module.exports = {
  controller: function (options) {
    var caretPos
    var scope = {
      editorEl: m.prop(),
      changeIndex: 0,
      content: options.content
    }

    function addFormatting (type) {
      return function () {
        scope.changeIndex++
        scope.content.formats.push({
          start: scope.selection[0], end: scope.selection[1], type: type
        })
        scope.content.formats.sort((a, b) => a.start > b.start)
        render()
      }
    }

    scope.makeBold = addFormatting('bold')
    scope.makeItalic = addFormatting('italic')

    scope.onChange = function (event) {
      caretPos = domHelper.getCaretCharacterOffsetWithin(event.target)
      var snippetIndex = Array.from(scope.editorEl().childNodes).indexOf(window.getSelection().focusNode)
      var selection = window.getSelection()
      var offset = scope.out[snippetIndex].start
      scope.selection = [offset + selection.anchorOffset, offset + selection.focusOffset]
      console.log(caretPos)
    }

    function render () {
      scope.out = applyFomat(scope.content)
    }
    render()

    return scope
  },
  view: function (scope) {
    return m('.editor', [
      m('button', { onclick: scope.makeBold }, 'bold'),
      m('button', { onclick: scope.makeItalic }, 'italic'),
      m('[contenteditable]', {
        key: scope.changeIndex,
        config: scope.editorEl,
        onmouseup: scope.onChange,
        onkeyup: scope.onChange,
        oninput: scope.onChange
      }, scope.out.map(content))
    ])
  }
}
