const m = require('mithril')

function getCaretCharacterOffsetWithin (element) {
  var caretOffset = 0
  var doc = element.ownerDocument || element.document
  var win = doc.defaultView || doc.parentWindow
  var sel
  if (typeof win.getSelection !== 'undefined') {
    sel = win.getSelection()
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0)
      var preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      caretOffset = preCaretRange.toString().length
    }
  } else if ((sel = doc.selection) && sel.type !== 'Control') {
    var textRange = sel.createRange()
    var preCaretTextRange = doc.body.createTextRange()
    preCaretTextRange.moveToElementText(element)
    preCaretTextRange.setEndPoint('EndToEnd', textRange)
    caretOffset = preCaretTextRange.text.length
  }
  return caretOffset
}

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
    return m(snippet.format.wrap, snippet.content)
  }
  return snippet.content
}

module.exports = {
  controller: function (options) {
    var scope = {
      editorEl: m.prop(),
      changeIndex: 0,
      content: options.content
    }

    scope.makeBold = addFormat('bold')
    scope.makeItalic = addFormat('em')

    function addFormat (type) {
      return function () {
        scope.changeIndex++
        scope.content.formats.push({
          start: scope.selection[0], end: scope.selection[1], wrap: type
        })
        scope.content.formats.sort((a, b) => a.start > b.start)
        render()
      }
    }

    scope.onChange = function (event) {
      scope.pos = getCaretCharacterOffsetWithin(event.target)
      var snippetIndex = Array.from(scope.editorEl().childNodes).indexOf(window.getSelection().focusNode)
      var selection = window.getSelection()
      var offset = scope.out[snippetIndex].start
      scope.selection = [offset + selection.anchorOffset, offset + selection.focusOffset]
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
