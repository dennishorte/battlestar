const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Abell Gallery Harpsichord`  // Card names are unique in Innovation
  this.name = `Abell Gallery Harpsichord`
  this.color = `purple`
  this.age = 4
  this.expansion = `arti`
  this.biscuits = `lhcl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For each value of top card on your board appearing exactly once, draw and score a card of that value in ascending order.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topCards = game.getTopCards(player)

      for (let i = 1; i <= 10; i++) {
        const matching = topCards.filter(card => card.getAge() === i).length
        if (matching === 1) {
          game.aDrawAndScore(player, i)
        }
      }
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
