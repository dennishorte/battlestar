const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Databases`  // Card names are unique in Innovation
  this.name = `Databases`
  this.color = `green`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a number of cards from your score pile equal to the value of your highest achievement.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      const achievementAges = game
        .getCardsByZone(player, 'achievements')
        .filter(c => !c.isSpecialAchievement && !c.isDecree)
        .map(c => c.getAge())
      const count = Math.max(...achievementAges)
      game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'), { count })
    }
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
