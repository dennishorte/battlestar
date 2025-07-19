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

  _afterMoveTo(newZone, _newIndex, prevZone) {
    // In Innovation, card ownership is determined entirely by where the card is located.
    this.owner = newZone.owner()

    // Moving cards out of a color stack can cause it to unsplay.
    if (prevZone.splay && prevZone.splay !== 'none' && prevZone.cards().length < 2) {
      this.game.log.add({
        template: '{zone} unsplays because it only has 1 card',
        args: { zone: prevZone }
      })
      prevZone.splay = 'none'
    }
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
