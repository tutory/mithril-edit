const m = require('mithril/render/hyperscript')
const render = require('mithril/render/render')(window, run).render
const editor = require('../')
const domReady = require('domready')

const initialContent = [
  { type: 'bold', content: [
    'Lorem ',
    { type: 'italic', content: 'ipsum dolor sit amet' }
  ]},
  'consetetur sadipscing elitr, sed diam nonumy eirmod tempor',
  { type: 'italic', content: 'invidunt ut labore et dolore magna' },
  'consetetur sadipscing elitr, sed diam nonumy eirmod tempor',
  { type: 'image', src: 'https://www.google.de/logos/doodles/2016/girls-and-boys-day-2016-4896490569859072-hp.jpg' },
  'consetetur sadipscing elitr, sed diam nonumy eirmod tempor'
]

function view () {
  return [
    m('h1', 'edit'),
    m(editor, {
      content: initialContent
    })
  ]
}

function run () {
  render(document.body, view())
}

domReady(run)
