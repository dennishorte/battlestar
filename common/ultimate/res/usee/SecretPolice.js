const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Secret Police`  // Card names are unique in Innovation
  this.name = `Secret Police`
  this.color = `yellow`
  this.age = 3
  this.expansion = `usee` // Corrected expansion
  this.biscuits = `kkkh`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you tuck a card in your hand, then return your top card of its color! If you do, repeat this effect! Otherwise, draw a {3}!`,
    `You may tuck any number of cards of any one color from your hand.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      while (true) {
        const tucked = game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'), { count: 1 })[0]

        if (tucked) {
          game.aReturn(player, game.getTopCard(player, tucked.color))
          continue
        }
        else {
          game.aDraw(player, { age: game.getEffectAge(this, 3) })
          break
        }
      }
    },
    (game, player) => {
      game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'), {
        title: 'Tuck any number of cards of the same color',
        min: 0,
        max: game.getCardsByZone(player, 'hand').length,
        guard: (cards) => util.array.distinct(cards.map(c => c.color)).length === 1,
      })
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
