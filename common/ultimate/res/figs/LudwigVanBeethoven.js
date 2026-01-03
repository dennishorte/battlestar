module.exports = {
  id: `Ludwig Van Beethoven`,  // Card names are unique in Innovation
  name: `Ludwig Van Beethoven`,
  color: `purple`,
  age: 6,
  expansion: `figs`,
  biscuits: `hp7c`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would score a card, first junk all cards from your score pile, then draw and score four {5}. If you score only {5}, draw and score four {5}.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry'
    },
    {
      trigger: 'score',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        const toJunk = game.cards.byPlayer(player, 'score')
        game.actions.junkMany(player, toJunk, { ordered: true })

        const drawn = [
          game.actions.drawAndScore(player, game.getEffectAge(self, 5)),
          game.actions.drawAndScore(player, game.getEffectAge(self, 5)),
          game.actions.drawAndScore(player, game.getEffectAge(self, 5)),
          game.actions.drawAndScore(player, game.getEffectAge(self, 5)),
        ]

        const ages = drawn.map(card => card.getAge())
        if (ages.every(age => age === game.getEffectAge(self, 5))) {
          game.actions.drawAndScore(player, game.getEffectAge(self, 5))
          game.actions.drawAndScore(player, game.getEffectAge(self, 5))
          game.actions.drawAndScore(player, game.getEffectAge(self, 5))
          game.actions.drawAndScore(player, game.getEffectAge(self, 5))
        }
      }
    }
  ]
}
