module.exports = {
  name: `Databases`,
  color: `green`,
  age: 10,
  expansion: `base`,
  biscuits: `hiii`,
  dogmaBiscuit: `i`,
  dogma: [
    `I demand you return a number of cards from your score pile equal to the value of your highest achievement.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const achievementAges = game
        .cards.byPlayer(player, 'achievements')
        .filter(c => !c.isSpecialAchievement && !c.isDecree)
        .map(c => c.getAge())
      const count = Math.max(...achievementAges)
      game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'), { count })
    }
  ],
}
