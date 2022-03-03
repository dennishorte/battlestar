const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Antibiotics`  // Card names are unique in Innovation
  this.name = `Antibiotics`
  this.color = `yellow`
  this.age = 8
  this.expansion = `base`
  this.biscuits = `lllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return up to three cards from your hand. For every different value of card that you returned, draw two {8}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand').cards()
      const cards = game.aChooseAndReturn(player, hand, { min: 0, max: 3 })

      if (cards) {
        const numValues = util.array.distinct(cards.map(c => c.age)).length
        for (let i = 0; i < numValues; i++) {
          game.aDraw(player, { age: game.getEffectAge(this, 8) })
          game.aDraw(player, { age: game.getEffectAge(this, 8) })
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
