const m = require('mithril')
const editor = require('../')
const domReady = require('domready')

const initialContent = {
  text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  formats: [
    { start: 10, end: 20, wrap: 'strong' },
    { start: 40, end: 50, wrap: 'em' }
  ]
}

domReady(() => {
  m.mount(document.body, {
    controller: function () {
      return {
        content: initialContent
      }
    },
    view: function (scope) {
      return [
        m('h1', 'edit'),
        m.component(editor, scope)
      ]
    }
  })
})
