import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `John Ericsson`,  // Card names are unique in Innovation
  name: `John Ericsson`,
  color: `red`,
  age: 7,
  expansion: `figs`,
  biscuits: `hffp`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would dogma a card of a color an opponent has splayed right, first unsplay that color on an opponent's board.`,
    `If an opponent would draw a card, first draw and tuck a {7}.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card }) => {
        const opponentSplays = game
          .players
          .opponents(player)
          .map(opponent => game.zones.byPlayer(opponent, card.color).splay)
        return opponentSplays.some(splay => splay === 'right')
      },
      func: (game, player, { card }) => {
        const opponentChoices = game
          .players
          .opponents(player)
          .filter(opponent => game.zones.byPlayer(opponent, card.color).splay === 'right')
        const opponent = game.actions.choosePlayer(player, opponentChoices)
        game.actions.unsplay(player, game.zones.byPlayer(opponent, card.color))
      }

    },
    {
      trigger: 'draw',
      triggerAll: true,
      matches: (game, player, { owner }) => player.isOpponent(owner),
      func: (game, player, { owner, self }) => {
        game.actions.drawAndTuck(owner, game.getEffectAge(self, 7))
      }
    }
  ]
} satisfies AgeCardData
