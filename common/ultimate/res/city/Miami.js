const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Miami`  // Card names are unique in Innovation
  this.name = `Miami`
  this.color = `yellow`
  this.age = 9
  this.expansion = `city`
  this.biscuits = `9c9l9h`
  this.dogmaBiscuit = `l`
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
