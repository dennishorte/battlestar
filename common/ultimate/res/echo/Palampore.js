const util = require('../../../lib/util.js')

module.exports = {
  name: `Palampore`,
  color: `green`,
  age: 5,
  expansion: `echo`,
  biscuits: `fhf5`,
  dogmaBiscuit: `f`,
  echo: ``,
  dogma: [
    `Draw and score a card of value equal to a bonus that occurs more than once on your board, if there is one.`,
    `You may splay your purple cards right.`,
    `If you have at least six bonuses on your board, claim the Wealth achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const groups = util
        .array
        .groupBy(player.bonuses(), x => x)
      const choices = Object
        .entries(groups)
        .filter(([, bonuses]) => bonuses.length >= 2)
        .map(([age,]) => parseInt(age))
        .sort()
      const age = game.actions.chooseAge(player, choices)
      if (age) {
        game.actions.drawAndScore(player, age)
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['purple'], 'right')
    },

    (game, player) => {
      const bonuses = player.bonuses()
      if (bonuses.length >= 6 && game.checkAchievementAvailable('Wealth')) {
        game.actions.claimAchievement(player, { name: 'Wealth' })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
  echoImpl: [],
}
