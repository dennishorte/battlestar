const { mag } = require('battlestar-common')

class UICardWrapper extends mag.util.wrapper.card {
  constructor(card) {
    super(card)
    this.__memo = 'UICardWrapper'
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
