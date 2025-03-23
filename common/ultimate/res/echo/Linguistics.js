const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Linguistics`  // Card names are unique in Innovation
  this.name = `Linguistics`
  this.color = `blue`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `ss&h`
  this.dogmaBiscuit = `s`
  this.echo = `Draw a {3} OR Draw and foreshadow a {4}.`
  this.karma = []
  this.dogma = [
    `Draw a card of value equal to a bonus on any board, if there is one. If you do, and Linguistics was foreseen, junk all available achievements of that value.`
  ]

  this.dogmaImpl = [
    (game, player, { foreseen, self }) => {
      const boardBonuses = game
        .getPlayerAll()
        .flatMap(p => game.getBonuses(p))
      const bonuses = util.array.distinct(boardBonuses).sort()
      const age = game.aChooseAge(player, bonuses, { title: 'Choose an age to draw from' })
      if (age) {
        game.aDraw(player, { age })

        if (foreseen) {
          game.mLogWasForeseen(self)
          const achievements = game
            .getAvailableStandardAchievements(player)
            .filter(x => x.getAge() === age)
          game.aJunkMany(player, achievements, { ordered: true })
        }
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = [
      `Draw a ${game.getEffectAge(this, 3)}`,
      `Draw and foreshadow a ${game.getEffectAge(this, 4)}`,
    ]
    const choice = game.aChoose(player, choices)[0]

    if (choice.includes('foreshadow')) {
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 4))
    }
    else {
      game.aDraw(player, { age: game.getEffectAge(this, 3) })
    }
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
