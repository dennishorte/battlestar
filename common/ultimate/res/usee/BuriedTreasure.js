const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Buried Treasure`  // Card names are unique in Innovation
  this.name = `Buried Treasure`
  this.color = `green`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose an odd value. Transfer all cards of that value from all score piles to the available achievements. If you transfer at least four cards, draw and safeguard a card of that value, and score three available standard achievements.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const oddValues = game.utilAges().filter(x => x % 2 === 1)
      const value = game.aChooseAge(player, oddValues)

      const toTransfer = game
        .getPlayerAll()
        .flatMap(p => game.getCardsByZone(p, 'score'))
        .filter(card => card.getAge() === value)

      const transferred = game.aTransferMany(player, toTransfer, game.getZoneById('achievements'))

      if (transferred.length >= 4) {
        game.aDrawAndSafeguard(player, value)

        const availableStandard = game.getAvailableStandardAchievements(player)
        game.aChooseAndScore(player, availableStandard, { count: 3 })
      }
    },
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
