const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Cross of Coronado`  // Card names are unique in Innovation
  this.name = `Cross of Coronado`
  this.color = `purple`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal your hand. If you have exactly five cards and five colors in your hand, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.getCardsByZone(player, 'hand')
      for (const card of cards) {
        game.mReveal(player, card)
      }

      const colors = util.array.distinct(cards.map(card => card.color))
      if (cards.length === 5 && colors.length === 5) {
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
