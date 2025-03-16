const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Shanghai`  // Card names are unique in Innovation
  this.name = `Shanghai`
  this.color = `yellow`
  this.age = 8
  this.expansion = `city`
  this.biscuits = `lcll:h`
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
