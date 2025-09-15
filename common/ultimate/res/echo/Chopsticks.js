module.exports = {
  name: `Chopsticks`,
  color: `yellow`,
  age: 1,
  expansion: `echo`,
  biscuits: `hll&`,
  dogmaBiscuit: `l`,
  echo: `You may draw and foreshadow a {1}.`,
  dogma: [
    `You may junk all cards in the {1} deck. If you do, achieve the highest card in the junk, if eligible.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const junked = game.actions.junkDeck(player, 1, { optional: true })
      if (junked) {
        const choices = game
          .util
          .highestCards(game.zones.byId('junk').cardlist())
          .filter(card => game.checkAchievementEligibility(player, card))
        game.actions.chooseAndAchieve(player, choices, { count: 1 })
      }
    }
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.drawAndForeshadow(player, game.getEffectAge(self, 1), { optional: true })
  },
}
