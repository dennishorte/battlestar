const util = require('../../../lib/util.js')

module.exports = {
  name: `Myth`,
  color: `purple`,
  age: 1,
  expansion: `usee`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `If you have two cards of the same color in your hand, tuck them both. If you do, splay left that color, and draw and safeguard a card of value equal to the value of your bottom card of that color.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.cards.byPlayer(player, 'hand')
      const cardsByColor = util.array.groupBy(hand, card => card.color)

      const colorsWithTwo = Object
        .entries(cardsByColor)
        .filter(([, cards]) => cards.length >= 2)
        .map(([color,]) => color)

      if (colorsWithTwo.length > 0) {
        const tuckable = hand.filter(c => colorsWithTwo.includes(c.color))
        const tucked = game.actions.chooseAndTuck(player, tuckable, {
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
          game.actions.safeguard(player, drawnCard)
        }
      }
      else {
        game.log.add({
          template: '{player} reveals hand to show no matching cards',
          args: { player },
        })
        game.actions.revealMany(player, hand, { ordered: true })
      }
    },
  ],
}
