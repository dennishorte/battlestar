const { mag } = require('battlestar-common')

class UICardWrapper extends mag.util.wrapper.card {
  constructor(card) {
    super(card)
    this.__memo = 'UICardWrapper'
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
    return new UICardWrapper(this.toJSON())
  }
}

module.exports = UICardWrapper
