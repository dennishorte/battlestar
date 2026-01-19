import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Yuna Kim`,  // Card names are unique in Innovation
  name: `Yuna Kim`,
  color: `purple`,
  age: 10,
  expansion: `figs`,
  biscuits: `hlpa`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would score a card, first if your top card of the same color has {k}, you win.`,
    `If a player would meld a card, instead return the top three cards of its color from all boards. Then that player tucks the card.`
  ],
  karmaImpl: [
    {
      trigger: 'score',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card, self }) => {
        const top = game.cards.top(player, card.color)

        if (top && top.checkHasBiscuit('k')) {
          game.youWin(player, self.name)
        }

      }
    },
    {
      trigger: 'meld',
      triggerAll: true,
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card, owner }) => {
        const toReturn = game
          .players
          .all()
          .flatMap(p => game.cards.byPlayer(p, card.color).slice(0, 3))
        game.actions.returnMany(owner, toReturn)

        game.actions.tuck(player, card)
      }
    }
  ]
} satisfies AgeCardData
