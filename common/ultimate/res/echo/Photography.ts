export default {
  name: `Photography`,
  color: `blue`,
  age: 7,
  expansion: `echo`,
  biscuits: `&sh7`,
  dogmaBiscuit: `s`,
  echo: `Meld a card from your forecast.`,
  dogma: [
    `I demand you transfer your highest top card to your hand.`,
    `If you have at least three echo effects visible in one color, claim the History achievement. If you do, and Photography was foreseen, you win.`
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game.util.highestCards(game.cards.tops(player))
      game.actions.chooseAndTransfer(player, choices, game.zones.byPlayer(player, 'hand'))
    },

    (game, player, { foreseen, self }) => {
      if (!game.checkAchievementAvailable('History')) {
        game.log.add({ template: 'The History achievement is not available' })
        return
      }

      const targetCount = 3
      const matches = game
        // Grab each stack
        .util
        .colors()
        .map(color => game.zones.byPlayer(player, color))

        // Convert each stack to a count of echo effects
        .map(zone => zone
          .cardlist()
          .map(card => {
            const visibleBiscuits = card.visibleBiscuits()
            const echoBiscuits = (visibleBiscuits.match(/&/g) || []).length
            return echoBiscuits
          })
          .reduce((prev, curr) => prev + curr, 0)
        )
        .some(count => count >= targetCount)

      if (matches) {
        game.actions.claimAchievement(player, { name: 'History' })

        game.log.addForeseen(foreseen, self)
        if (foreseen) {
          game.youWin(player, self.name)
        }
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
