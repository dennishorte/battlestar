const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Prague`  // Card names are unique in Innovation
  this.name = `Prague`
  this.color = `blue`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `ss:i:h`
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
