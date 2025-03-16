const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Treaty of Kadesh`  // Card names are unique in Innovation
  this.name = `Treaty of Kadesh`
  this.color = `blue`
  this.age = 1
  this.expansion = `arti`
  this.biscuits = `ckhk`
  this.dogmaBiscuit = `k`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return all top cards from your board with a demand effect!`,
    `Score a top, non-blue card from your board with a demand effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toReturn = game
        .getTopCards(player)
        .filter(card => card.checkHasDemand())
      game.aReturnMany(player, toReturn)
    },

    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasDemand())
        .filter(card => card.color !== 'blue')
      game.aChooseAndScore(player, choices)
    },
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
