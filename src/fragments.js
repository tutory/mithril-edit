module.exports = function () {
  var fragments = []

  function byEl (el) {
    const fragmentByEl = fragments.find(fragment => fragment.el === el)
    if (!fragmentByEl) {
      throw new Error('no selected fragment found')
    }
    return fragmentByEl
  }

  return {
    reset: function () {
      fragments = []
    },
    byEl: byEl,
    push: function (fragment) {
      fragments.push(fragment)
    },
    selection: function (domSelection) {
      if (!domSelection.focusNode) {
        return
      }
      if (domSelection.focusNode === domSelection.anchorNode) {
        var selectedFragment = byEl(domSelection.focusNode)
        var fragmentAfterSelected = fragments[fragments.indexOf(selectedFragment) + 1]
        return {
          selectedFragments: [selectedFragment, fragmentAfterSelected],
          startFragment: selectedFragment,
          start: domSelection.focusOffset,
          endFragment: selectedFragment,
          end: domSelection.focusOffset
        }
      }
      var isSelected = false
      const selectedFragments = fragments.filter(function (fragment) {
        if (fragment.el === domSelection.focusNode || fragment.el === domSelection.anchorNode) {
          isSelected = !isSelected
          if (!isSelected) {
            // also add last matching node
            return true
          }
        }
        return isSelected
      })
      const firstSelectedFragment = selectedFragments[0]
      const lastSelectedFragment = selectedFragments[selectedFragments.length - 1]
      return {
        selectedFragments: selectedFragments,
        startFragment: firstSelectedFragment,
        start: firstSelectedFragment.el === domSelection.focusNode ? domSelection.focusOffset : domSelection.anchorOffset,
        endFragment: lastSelectedFragment,
        end: lastSelectedFragment.el === domSelection.focusNode ? domSelection.focusOffset : domSelection.anchorOffset
      }
    }
  }
}
