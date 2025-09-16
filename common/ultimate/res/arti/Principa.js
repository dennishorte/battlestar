const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Principa`  // Card names are unique in Innovation
  this.name = `Principa`
  this.color = `blue`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all non-blue top cards from your board. For each card returned, draw and meld a card of value one higher than the value of the returned card, in ascending order.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const toReturn = game
        .getTopCards(player)
        .filter(card => card.color !== 'blue')

      const returned = game
        .aReturnMany(player, toReturn)
        .sort((l, r) => l.getAge() - r.getAge())

      for (const card of returned) {
        game.aDrawAndMeld(player, card.getAge() + 1)
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
