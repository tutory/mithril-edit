const m = require('mithril')

module.exports = {
  bold: {
    render: function (content) {
      return m('strong', content)
    }
  },
  italic: {
    render: function (content) {
      return m('em', content)
    }
  },
  image: {
    render: function (content, format) {
      return m('img', format.options)
    }
  }
}
