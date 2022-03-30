const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Self Service`  // Card names are unique in Innovation
  this.name = `Self Service`
  this.color = `green`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Execute each of the non-demand dogma effects of any other top card on your board. Do not share them.`,
    `If you have more achievements than each opponent, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card !== this)
      const card = game.aChooseCard(player, choices)
      if (card) {
        game.aCardEffects(player, card, 'dogma')
      }
    },

    (game, player) => {
      const mine = game.getCardsByZone(player, 'achievements').length
      const others = game
        .getPlayerOpponents(player)
        .map(player => game.getCardsByZone(player, 'achievements').length)

      if (others.every(count => count < mine)) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
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
