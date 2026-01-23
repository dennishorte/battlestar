module.exports = {
  name: `Kaleidoscope`,
  color: `purple`,
  age: 6,
  expansion: `echo`,
  biscuits: `6shs`,
  dogmaBiscuit: `s`,
  echo: [],
  dogma: [
    `Draw and meld a {7}. You may splay your cards of that color right.`,
    `Junk an available achievement of value equal to the number of {s} on your board. If Kaleidoscope was foreseen, junk all available achievements of lower value.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 7))
      if (card) {
        game.actions.chooseAndSplay(player, [card.color], 'right')
      }
    },

    (game, player, { foreseen, self }) => {
      const count = player.biscuits().s
      game.actions.junkAvailableAchievement(player, [count])

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        const achievements = player
          .availableStandardAchievements()
          .filter(card => card.getAge() < count)
        game.actions.junkMany(player, achievements)
      }
    },
  ],
  echoImpl: [],
}
