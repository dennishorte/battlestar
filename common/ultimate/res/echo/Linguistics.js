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
        .flatMap(p => p.bonuses())
      const bonuses = util.array.distinct(boardBonuses).sort()
      const age = game.actions.chooseAge(player, bonuses, { title: 'Choose an age to draw from' })
      if (age) {
        game.actions.draw(player, { age })

        game.log.addForeseen(foreseen, self)
        if (foreseen) {
          const achievements = player
            .availableStandardAchievements()
            .filter(x => x.getAge() === age)
          game.actions.junkMany(player, achievements, { ordered: true })
        }
      }
    }
  ],
  echoImpl: (game, player, { self }) => {
    const choices = [
      `Draw a ${game.getEffectAge(self, 3)}`,
      `Draw and foreshadow a ${game.getEffectAge(self, 4)}`,
    ]
    const choice = game.actions.choose(player, choices)[0]

    if (choice.includes('foreshadow')) {
      game.actions.drawAndForeshadow(player, game.getEffectAge(self, 4))
    }
    else {
      game.actions.draw(player, { age: game.getEffectAge(self, 3) })
    }
  },
}
