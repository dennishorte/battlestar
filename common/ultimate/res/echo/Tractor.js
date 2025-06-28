const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tractor`  // Card names are unique in Innovation
  this.name = `Tractor`
  this.color = `yellow`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `&iih`
  this.dogmaBiscuit = `i`
  this.echo = `Draw a {7}.`
  this.karma = []
  this.dogma = [
    `Draw and score a {7}. Draw a {7}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 7))
      game.aDraw(player, { age: game.getEffectAge(this, 7) })
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 7) })
  }
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
