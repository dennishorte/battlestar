
const util = require('../../../lib/util.js')

module.exports = {
  name: `Linguistics`,
  color: `blue`,
  age: 2,
  expansion: `echo`,
  biscuits: `ss&h`,
  dogmaBiscuit: `s`,
  echo: `Draw a {3} OR Draw and foreshadow a {4}.`,
  dogma: [
    `Draw a card of value equal to a bonus on any board, if there is one. If you do, and Linguistics was foreseen, junk all available achievements of that value.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      const boardBonuses = game
        .players.all()
        .flatMap(p => game.getBonuses(p))
      const bonuses = util.array.distinct(boardBonuses).sort()
      const age = game.actions.chooseAge(player, bonuses, { title: 'Choose an age to draw from' })
      if (age) {
        game.actions.draw(player, { age })

        if (foreseen) {
          game.log.addForeseen(self)
          const achievements = game
            .getAvailableStandardAchievements(player)
            .filter(x => x.getAge() === age)
          game.aJunkMany(player, achievements, { ordered: true })
        }
      }
    }
  ],
  echoImpl: (game, player) => {
    const choices = [
      `Draw a ${game.getEffectAge(this, 3)}`,
      `Draw and foreshadow a ${game.getEffectAge(this, 4)}`,
    ]
    const choice = game.actions.choose(player, choices)[0]

    if (choice.includes('foreshadow')) {
      game.actions.drawAndForeshadow(player, game.getEffectAge(this, 4))
    }
    else {
      game.actions.draw(player, { age: game.getEffectAge(this, 3) })
    }
  },
}
