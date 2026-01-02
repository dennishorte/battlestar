module.exports = {
  id: `Galileo Galilei`,  // Card names are unique in Innovation
  name: `Galileo Galilei`,
  color: `green`,
  age: 4,
  expansion: `figs`,
  biscuits: `hccp`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would draw a card, first junk all cards in the {4} or {5} deck.`,
    `If you would meld a card, first junk an available achievement of value 3, 4, or 5.`,
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        game.actions.chooseAndJunkDeck(player, [game.getEffectAge(self, 4), game.getEffectAge(self, 5)])
      },
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        game.actions.junkAvailableAchievement(player, [3, 4, 5])
      },
    }
  ]
}
