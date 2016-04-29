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

function setCaretPos (el, pos) {
  var range = document.createRange()
  var sel = window.getSelection()
  el.focus()
  range.setStart(el.childNodes[0], pos)
  range.setEnd(el.childNodes[0], pos)
  sel.removeAllRanges()
  sel.addRange(range)
}

module.exports = { getCaretCharacterOffsetWithin, setCaretPos}
