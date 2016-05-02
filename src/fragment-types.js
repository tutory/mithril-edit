const m = require('mithril')

module.exports = {
  string: {
    render: function (fragment) {
      return m('span', fragment.content)
    }
  },
  array: {
    render: function (fragment, render) {
      return fragment.content.map(render)
    }
  },
  bold: {
    render: function (fragment, render) {
      return m('strong', render(fragment.content))
    }
  },
  italic: {
    render: function (fragment, render) {
      return m('em', render(fragment.content))
    }
  },
  image: {
    render: function (fragment) {
      return m('img', {
        src: fragment.src
      })
    }
  }
}
