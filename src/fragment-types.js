const m = require('mithril/render/hyperscript')

module.exports = {
  string: {
    render: function (fragment) {
      return { tag: '#', children: fragment.content }
    }
  },
  array: {
    render: function (fragment, render) {
      return fragment.content.map(render)
    }
  },
  bold: {
    render: function (fragment, render) {
      // we have to do this in order to force mithril to create text-nodes
      return m('strong', ['', render(fragment.content)])
    }
  },
  italic: {
    render: function (fragment, render) {
      return m('em', ['', render(fragment.content)])
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
