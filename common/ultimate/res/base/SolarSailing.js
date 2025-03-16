const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Solar Sailing`  // Card names are unique in Innovation
  this.name = `Solar Sailing`
  this.color = `blue`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `issh`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld an {e}. If its color is not splayed aslant on your board, return all but your top four cards of that color, and splay that color aslant. If there are at least six cards of that color on your board, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 11))
      if (!card) {
        game.mLogNoEffect()
        return
      }

      const color = card.color
      const zone = game.getZoneByPlayer(player, color)

      if (zone.splay !== 'aslant') {
        const cards = zone.cards()
        if (cards.length > 4) {
          const toReturn = cards.slice(4)
          game.aReturnMany(player, toReturn, { ordered: true })
        }

        game.aSplay(player, color, 'aslant')
      }

      // Check for win condition
      const colorCount = zone.cards().length
      if (colorCount >= 6) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
