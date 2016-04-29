function insertIntoString (string, what, index) {
  return index > 0
    ? string.replace(new RegExp('.{' + index + '}'), '$&' + what)
    : what + string
}

module.exports = { insertIntoString }


