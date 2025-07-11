const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Myth`  // Card names are unique in Innovation
  this.name = `Myth`
  this.color = `purple`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `If you have two cards of the same color in your hand, tuck them both. If you do, splay left that color, and draw and safeguard a card of value equal to the value of your bottom card of that color.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getCardsByZone(player, 'hand')
      const cardsByColor = util.array.groupBy(hand, card => card.color)

      const colorsWithTwo = Object
        .entries(cardsByColor)
        .filter(([, cards]) => cards.length >= 2)
        .map(([color,]) => color)

      if (colorsWithTwo.length > 0) {
        const tuckable = hand.filter(c => colorsWithTwo.includes(c.color))
        const tucked = game.aChooseAndTuck(player, tuckable, {
          title: 'Tuck two cards with the same color',
          count: 2,
          guard: (toTuck) => {
            if (toTuck.length == 2 && toTuck[0].color === toTuck[1].color) {
              return true
            }
            else if (toTuck.length < 2) {
              return true
            }
            else {
              return false
            }
          }
        })

        if (tucked.length == 2) {
          game.aSplay(player, tucked[0].color, 'left')
          const bottomCard = game.getBottomCard(player, tucked[0].color)
          const bottomValue = bottomCard ? bottomCard.age : 1
          const drawnCard = game.aDraw(player, { age: bottomValue })
          game.aSafeguard(player, drawnCard)
        }
      }
      else {
        game.log.add({
          template: '{player} reveals hand to show no matching cards',
          args: { player },
        })
        game.aRevealMany(player, hand, { ordered: true })
      }
    },
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
