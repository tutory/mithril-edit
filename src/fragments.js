module.exports = function () {
  var fragments = []

  return {
    reset: function () {
      fragments = []
    },
    byEl: function (el) {
      const fragmentByEl = fragments.find(fragment => fragment.el === el)
      if (!fragmentByEl) {
        throw new Error('no selected fragment found')
      }
      return fragmentByEl
    },
    push: function (fragment) {
      fragments.push(fragment)
    }
  }
}
