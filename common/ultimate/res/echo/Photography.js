module.exports = {
  name: `Photography`,
  color: `blue`,
  age: 7,
  expansion: `echo`,
  biscuits: `&sh7`,
  dogmaBiscuit: `s`,
  echo: `Meld a card from your forecast.`,
  dogma: [
    `I demand you take the highest top card from your board into your hand.`,
    `If you have at least three echo effects visible in one color, claim the History achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game.util.highestCards(game.cards.tops(player))
      game.actions.chooseAndTransfer(player, choices, game.zones.byPlayer(player, 'hand'))
    },

    (game, player) => {
      if (!game.checkAchievementAvailable('History')) {
        game.log.addNoEffect()
      }

      const targetCount = 3
      const matches = game
        // Grab each stack
        .util.colors()
        .map(color => game.zones.byPlayer(player, color))

        // Convert each stack to a count of echo effects
        .map(zone => zone
          .cardlist()
          .map(c => (game.getBiscuitsRaw(c, zone.splay).match(/&/g) || []).length )
          .reduce((prev, curr) => prev + curr, 0)
        )
        .some(count => count >= targetCount)

      if (matches) {
        game.aClaimAchievement(player, { name: 'History' })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
  echoImpl: (game, player) => {
    game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'forecast'))
  },
}
