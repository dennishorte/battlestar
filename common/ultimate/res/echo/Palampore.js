
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
    `Draw and score a card of value equal to a bonus that occurs more than once on your board, if you have such a bonus.`,
    `You may splay your purple cards right.`,
    `If you have six or more bonuses on your board, claim the Wealth achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const groups = util
        .array
        .groupBy(game.getBonuses(player), x => x)
      const choices = Object
        .entries(groups)
        .filter(([, bonuses]) => bonuses.length >= 2)
        .map(([age,]) => parseInt(age))
        .sort()
      const age = game.aChooseAge(player, choices)
      if (age) {
        game.actions.drawAndScore(player, age)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'right')
    },

    (game, player) => {
      const bonuses = game.getBonuses(player)
      if (bonuses.length >= 6 && game.checkAchievementAvailable('Wealth')) {
        game.aClaimAchievement(player, { name: 'Wealth' })
      }
      else {
        game.mLogNoEffect()
      }
    },
  ],
  echoImpl: [],
}
