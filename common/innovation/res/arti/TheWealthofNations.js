const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Wealth of Nations`  // Card names are unique in Innovation
  this.name = `The Wealth of Nations`
  this.color = `green`
  this.age = 6
  this.expansion = `arti`
  this.biscuits = `cfhc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score a {1}. Add up the values of all the cards in your score pile, divide by five, and round up. Draw and score a card of value equal to the result.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 1))

      const totalValue = game
        .getCardsByZone(player, 'score')
        .map(card => card.getAge())
        .reduce((agg, next) => agg + next, 0)

      const age = Math.ceil(totalValue / 5)
      game.aDrawAndScore(player, age)
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
