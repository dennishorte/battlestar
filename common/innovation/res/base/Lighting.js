const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Lighting`  // Card names are unique in Innovation
  this.name = `Lighting`
  this.color = `purple`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `hlil`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may tuck up to three cards from your hand. If you do, draw and score a {7} for every different value of card you tucked.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndTuck(
        player,
        game.getCardsByZone(player, 'hand'),
        { min: 0, max: 3},
      )
      if (cards) {
        const ages = util.array.distinct(cards.map(card => card.age))
        for (let i = 0; i < ages.length; i++) {
          game.aDrawAndScore(player, game.getEffectAge(this, 7))
        }
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
