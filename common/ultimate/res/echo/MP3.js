const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `MP3`  // Card names are unique in Innovation
  this.name = `MP3`
  this.color = `yellow`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `cahc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return any number of cards from your hand. For each card returned, claim two standard achievements for which you are eligible.`,
    `Draw and score a card of value equal to a bonus on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const returned = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'), { min: 0, max: 999 })

      if (returned) {
        const toAchieve = returned.length * 2
        for (let i = 0; i < toAchieve; i++) {
          const choices = game.getEligibleAchievementsRaw(player)
          if (choices) {
            game.aChooseAndAchieve(player, choices)
          }
          else {
            game.mLog({ template: 'No eligible achievements' })
            break
          }
        }
      }
    },

    (game, player) => {
      const choices = util.array.distinct(game.getBonuses(player)).sort()
      const age = game.aChooseAge(player, choices, { title: 'Choose an age to draw and score' })
      if (age) {
        game.aDrawAndScore(player, age)
      }
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
