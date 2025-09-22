module.exports = {
  name: `Bifocals`,
  color: `blue`,
  age: 6,
  expansion: `echo`,
  biscuits: `&hcc`,
  dogmaBiscuit: `c`,
  echo: `Return a card from your forecast.`,
  dogma: [
    `Draw and foreshadow a {7}. If Bifocals was foreseen, draw and foreshadow a card of value equal to the lowest available standard achievement.`,
    `You may splay your green cards right. If you do, splay up any color of your cards.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 7))

      game.log.addForeseen(foreseen, self)
      if (foreseen) {
        const age = game
          .getAvailableStandardAchievements(player)
          .map(achievement => achievement.age)
          .sort((l, r) => l - r)[0] || 0

        game.actions.drawAndForeshadow(player, age)
      }
    },

    (game, player) => {
      const splayed = game.actions.chooseAndSplay(player, ['green'], 'right')
      if (splayed) {
        game.actions.chooseAndSplay(player, game.util.colors(), 'up', { count: 1 })
      }
    }
  ],
  echoImpl: (game, player) => {
    game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'forecast'))
  },
}
