const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alexandria`  // Card names are unique in Innovation
  this.name = `Alexandria`
  this.color = `blue`
  this.age = 2
  this.expansion = `city`
  this.biscuits = `c2cs+h`
  this.dogmaBiscuit = `c`
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
