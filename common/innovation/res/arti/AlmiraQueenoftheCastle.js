const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Almira, Queen of the Castle`  // Card names are unique in Innovation
  this.name = `Almira, Queen of the Castle`
  this.color = `purple`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `chcc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand. Claim an achievement of matching value, ignoring eligiblilty.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        const achievements = game
          .getAvailableAchievementsRaw(player)
          .filter(card => card.getAge() === cards[0].getAge())
        game.aChooseAndAchieve(player, achievements)
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
