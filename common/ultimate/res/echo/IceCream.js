module.exports = {
  name: `Ice Cream`,
  color: `purple`,
  age: 7,
  expansion: `echo`,
  biscuits: `h8l&`,
  dogmaBiscuit: `l`,
  echo: `Score a non-purple top card from your board without a bonus.`,
  dogma: [
    `I demand you draw and meld a {1}!`,
    `Choose the {6}, {7}, {8}, or {9} deck. If there is at least one card in that deck, you may transfer its bottom card to the available achievements.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.drawAndMeld(player, game.getEffectAge(this, 1))
    },

    (game, player) => {
      const addAchievement = game.aYesNo(player, 'Transfer a card to the available achievements?')

      if (addAchievement) {
        const age = game.actions.chooseAge(player, [
          game.getEffectAge(this, 6),
          game.getEffectAge(this, 7),
          game.getEffectAge(this, 8),
          game.getEffectAge(this, 9),
        ].filter(age => age <= 10))

        const cards = game.zones.byDeck('base', age).cardlist()
        if (cards.length > 0) {
          const toTransfer = cards[cards.length - 1]
          game.actions.transfer(player, toTransfer, game.zones.byId('achievements'))
        }
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = game
      .cards.tops(player)
      .filter(card => card.color !== 'purple')
      .filter(card => !card.checkHasBonus())
    game.actions.chooseAndScore(player, choices)
  },
}
