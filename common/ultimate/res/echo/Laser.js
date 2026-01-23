module.exports = {
  name: `Laser`,
  color: `blue`,
  age: 9,
  expansion: `echo`,
  biscuits: `sshl`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `Return 4 cards from your score pile. Return all available standard achievements.`,
    `Draw and foreshadow and {b}. Draw and meld a {0}. If Laser was foreseen, draw and meld an {b}.`,

  ],
  dogmaImpl: [
    (game, player) => {
      const scoreCards = game.cards.byPlayer(player, 'score')
      game.actions.chooseAndReturn(player, scoreCards, { count: 4 })

      const toReturn = player.availableStandardAchievements()
      game.actions.returnMany(player, toReturn)
    },

    (game, player, { foreseen, self }) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 11))
      game.actions.drawAndMeld(player, game.getEffectAge(self, 10))

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        game.actions.drawAndMeld(player, game.getEffectAge(self, 11))
      }
    }
  ],
  echoImpl: [],
}
