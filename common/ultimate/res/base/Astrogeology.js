const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Astrogeology`  // Card names are unique in Innovation
  this.name = `Astrogeology`
  this.color = `red`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `chff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal an {e}. Splay its color on your board aslant. If you do, transfer all but your top four cards of that color to your hand.`,
    `If you have at least eight cards in your hand, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 11))
      if (card) {
        const color = card.color
        const splayed = Boolean(game.aSplay(player, color, 'aslant'))

        if (splayed) {
          const cards = game.getCardsByZone(player, color)
          if (cards.length > 4) {
            const toReturn = cards.slice(4)
            game.aTransferMany(player, toReturn, game.getZoneByPlayer(player, 'hand'), { ordered: true })
          }
        }
      }
    },

    (game, player) => {
      const handSize = game.getZoneByPlayer(player, 'hand').cards().length
      if (handSize >= 8) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      } else {
        game.mLogNoEffect()
      }
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
