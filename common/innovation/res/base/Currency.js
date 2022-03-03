const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Currency`  // Card names are unique in Innovation
  this.name = `Currency`
  this.color = `green`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `lchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return any number of cards from your hand. If you do, draw and score a {2} for every different value of card you returned.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getCardsByZone(player, 'hand')
      const cards = game.aChooseAndReturn(player, hand, { min: 0, max: hand.length })

      const toScore = util.array.distinct(cards.map(card => card.age)).length
      for (let i = 0; i < toScore; i++) {
        game.aDrawAndScore(player, game.getEffectAge(this, 2))
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
