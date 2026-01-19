import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Wernher Von Braun`,  // Card names are unique in Innovation
  name: `Wernher Von Braun`,
  color: `blue`,
  age: 9,
  expansion: `figs`,
  biscuits: `pssh`,
  dogmaBiscuit: `s`,
  karma: [
    `If a player would draw a figure, first junk all cards in the {9} or {0} deck.`,
    `Each valued card in the junk counts as being in your score pile.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { exp }) => exp === 'figs',
      func: (game, player, { owner, self }) => {
        game.actions.chooseAndJunkDeck(owner, [game.getEffectAge(self, 9), game.getEffectAge(self, 10)])
      }

    },
    {
      trigger: 'list-score',
      func(game, player) {
        return [
          ...game.zones.byPlayer(player, 'score')._cards,
          ...game.zones.byId('junk')._cards,
        ]
      }
    }
  ]
} satisfies AgeCardData
