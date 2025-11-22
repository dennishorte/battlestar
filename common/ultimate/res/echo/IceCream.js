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
    `Choose the {6}, {7}, {8}, or {9} deck. You may junk all cards in the chosen deck. If you do, achieve the highest card in the junk, if eligible.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 1))
    },

    (game, player, { self }) => {
      const ages = [
        game.getEffectAge(self, 6),
        game.getEffectAge(self, 7),
        game.getEffectAge(self, 8),
        game.getEffectAge(self, 9),
      ].filter(age => age <= 11)

      const junked = game.actions.chooseAndJunkDeck(player, ages, { min: 0 })
      if (junked) {
        const options = game
          .util
          .highestCards(game.cards.byZone('junk'))
          .filter(card => game.checkAchievementEligibility(player, card))
        game.actions.chooseAndAchieve(player, options)
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
