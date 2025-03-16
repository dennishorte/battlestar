const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Madrid`  // Card names are unique in Innovation
  this.name = `Madrid`
  this.color = `blue`
  this.age = 4
  this.expansion = `city`
  this.biscuits = `sssc<h`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = []

  this.dogmaImpl = [
    (game, player) => {

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
