const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Berlin`  // Card names are unique in Innovation
  this.name = `Berlin`
  this.color = `blue`
  this.age = 6
  this.expansion = `city`
  this.biscuits = `ff>s;h`
  this.dogmaBiscuit = `f`
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
