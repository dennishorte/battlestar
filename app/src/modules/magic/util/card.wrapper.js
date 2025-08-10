import { magic } from 'battlestar-common'


class UICardWrapper extends magic.MagicCard {
  constructor(game, card) {
    super(game, card)
    this.__memo = 'UICardWrapper'
  }

  colorIndicatorClasses(faceIndex) {
    const unsortedColors = this
      .colorIndicator(faceIndex)
      .map(c => c.toLowerCase())

    const colors = magic.util.card.sortManaArray(unsortedColors)

    if (colors.length === 0) {
      return null
    }

    if (colors.length === 1) {
      return ['ms-ci-' + colors[0], 'ms-ci-1']
    }

    if (colors.length === 2) {
      const pairs = ['wu', 'wb', 'ub', 'ur', 'bg', 'br', 'rw', 'rg', 'gu', 'gw']
      for (const pair of pairs) {
        if (_testColorsIncluded(colors, pair)) {
          return ['ms-ci-' + pair, 'ms-ci-2']
        }
      }
      throw new Error('No pair matches the color indicator: ' + colors)
    }

    if (colors.length === 3) {
      const triplets = ['wug', 'ubw', 'bru', 'rgb', 'gwr', 'wbg', 'urw', 'bgu', 'rwb', 'gur']
      for (const triplet of triplets) {
        if (_testColorsIncluded(colors, triplet)) {
          return ['ms-ci-' + triplet, 'ms-ci-3']
        }
      }
      throw new Error('No triplet matches the color indicator: ' + colors)
    }

    if (colors.length === 4) {
      const quads = ['ubrg', 'brgw', 'rgwu', 'gwub', 'wubr']
      for (const quad of quads) {
        if (_testColorsIncluded(colors, quad)) {
          return ['ms-ci-' + quad, 'ms-ci-4']
        }
      }
      throw new Error('No quad matches the color indicator: ' + colors)
    }

    if (colors.length === 5) {
      return ['ms-ci-5']
    }
  }

  displayName(player, faceIndex=null) {
    if (this.isVisible(player)) {
      return this.name(faceIndex)
    }
    else if (this.g.secret) {
      return 'secret'
    }
    else if (this.g.morph) {
      return 'morph'
    }
    else {
      return 'hidden'
    }
  }

  frameColor(faceIndex) {
    if (this.isArtifact(faceIndex)) {
      return 'artifact'
    }
    else if (this.isLand(faceIndex)) {
      return 'land'
    }
    else if (this.isColorless(faceIndex)) {
      return 'artifact'
    }
    else if (this.isMulticolor(faceIndex)) {
      return 'gold'
    }
    else {
      return this.colorName(faceIndex)
    }
  }

  clone() {
    return new UICardWrapper(this.game, this.toJSON())
  }
}

function _testColorsIncluded(array, string) {
  return string.split('').every(color => array.includes(color))
}

export default UICardWrapper
