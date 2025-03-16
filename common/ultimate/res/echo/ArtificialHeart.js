const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Artificial Heart`  // Card names are unique in Innovation
  this.name = `Artificial Heart`
  this.color = `blue`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `hllb`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Claim a standard achievement, if eligible. Your current score is doubled for the purpose of checking eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getEligibleAchievementsRaw(player, { doubleScore: true })
        .filter(card => card.zone === 'achievements')

      game.aChooseAndAchieve(player, choices)
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
