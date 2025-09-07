const { BaseCard } = require('../lib/game/index.js')

class UltimateBaseCard extends BaseCard {
  constructor(game, data) {
    super(game, data)

    // Card names are unique in Innovation, so we'll use them for the card IDs.
    this.id = data.name
  }

  checkHasBiscuit(biscuit) {
    if (!this.biscuits) {
      return false
    }

    return this
      .getBiscuits('top')
      .includes(biscuit)
  }

  checkIsStandardAchievement() {
    return !this.isSpecialAchievement && !this.isDecree
  }

  getAge() {
    return this.age
  }

  getHiddenName(game=null) {
    if (this.isSpecialAchievement || this.isDecree) {
      return this.name
    }

    const owner = game?.players.byOwner(this)
    if (owner) {
      return `*${this.expansion}-${this.age}* (${owner.name})`
    }
    else {
      return `*${this.expansion}-${this.age}*`
    }
  }

  _afterMoveTo(newZone) {
    // In Innovation, card ownership is determined entirely by where the card is located.
    this.owner = newZone.owner()
  }

  _beforeMoveTo(newZone, newIndex, prevZone, prevIndex) {
    if (prevZone === newZone && prevIndex === newIndex) {
      return {
        preventDefault: true,
      }
    }
  }
}

module.exports = {
  UltimateBaseCard,
}
