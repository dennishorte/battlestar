const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Holy Grail`  // Card names are unique in Innovation
  this.name = `Holy Grail`
  this.color = `yellow`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `lhcl`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your hand. Claim an achievement of matching value ignoring eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        const choices = game
          .getAvailableAchievementsRaw(player)
          .filter(ach => ach.getAge() === card.age)
        game.aChooseAndAchieve(player, choices)
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
