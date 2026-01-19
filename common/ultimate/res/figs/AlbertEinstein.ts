import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Albert Einstein`,  // Card names are unique in Innovation
  name: `Albert Einstein`,
  color: `blue`,
  age: 8,
  expansion: `figs`,
  biscuits: `hsp8`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would take a Draw action, first meld all cards with {s} or {i} from each player's hand.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement'
    },
    {
      trigger: 'draw-action',
      kind: 'would-first',
      matches: () => true,
      func(game, player) {
        const toMeld = game
          .players
          .all()
          .flatMap(other => game.cards.byPlayer(other, 'hand'))
          .filter(card => card.checkHasBiscuit('s') || card.checkHasBiscuit('i'))

        game.actions.revealMany(player, toMeld, { ordered: true })
        game.actions.meldMany(player, toMeld)
      }

    }
  ]
} satisfies AgeCardData
