module.exports = {
  id: `Confucius`,  // Card names are unique in Innovation
  name: `Confucius`,
  color: `purple`,
  age: 2,
  expansion: `figs`,
  biscuits: `hlp3`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would dogma a card using {k} as a featured icon, instead score the card and junk all cards in the {2} deck or the {3} deck.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game, player, { featuredBiscuit }) => featuredBiscuit === 'k',
      func: (game, player, { card, self }) => {
        game.actions.score(player, card)
        game.actions.chooseAndJunkDeck(player, [
          game.getEffectAge(self, 2),
          game.getEffectAge(self, 3),
        ])
      },
    }
  ]
}
