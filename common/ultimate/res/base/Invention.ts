export default {
  name: `Invention`,
  color: `green`,
  age: 4,
  expansion: `base`,
  biscuits: `hssf`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may splay right any one color of your cards currently splayed left. If you do, draw and score a {4}.`,
    `If you have five colors splayed, each in any direction, claim the Wonder achievement.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const splayedLeft = game
        .util.colors()
        .filter(color => game.zones.byPlayer(player, color).splay === 'left')
      const colors = game.actions.chooseAndSplay(player, splayedLeft, 'right')
      if (colors && colors.length > 0) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 4))
      }
    },

    (game, player) => {
      const splayCount = game
        .util.colors()
        .filter(color => game.zones.byPlayer(player, color).splay !== 'none')
        .length

      const achievementAvailable = game.checkAchievementAvailable('Wonder')

      if (achievementAvailable && splayCount === 5) {
        game.actions.claimAchievement(player, { name: 'Wonder' })
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
