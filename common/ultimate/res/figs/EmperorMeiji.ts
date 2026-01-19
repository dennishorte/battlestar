import util from '../../../lib/util.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Emperor Meiji`,  // Card names are unique in Innovation
  name: `Emperor Meiji`,
  color: `purple`,
  age: 7,
  expansion: `figs`,
  biscuits: `hiip`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would meld a {0} and you have top cards of five different values on your board, instead you win.`,
    `One your turn, until your second action, each card in an opponent's hand counts as being in your hand.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player) => {
        const topValues = game.cards.tops(player).map(card => card.getAge())
        const uniqueValues = util.array.distinct(topValues)
        return uniqueValues.length === 5
      },
      func: (game, player, { self }) => {
        game.youWin(player, self.name)
      }

    },

    {
      trigger: 'list-hand',
      func: (game, player) => {
        const playerTurnCondition = game.players.current().id === player.id
        const actionNumberCondition = game.state.actionNumber < 2

        if (playerTurnCondition && actionNumberCondition) {
          const opponentHands = game
            .players
            .opponents(player)
            .flatMap(opponent => game.zones.byPlayer(opponent, 'hand').cardlist({ noKarma: true }))

          return [
            ...game.zones.byPlayer(player, 'hand').cardlist({ noKarma: true }),
            ...opponentHands,
          ]
        }
        else {
          return game.zones.byPlayer(player, 'hand').cardlist({ noKarma: true })
        }
      }
    }
  ]
} satisfies AgeCardData
