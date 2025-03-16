const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Beirut`  // Card names are unique in Innovation
  this.name = `Beirut`
  this.color = `green`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `cpcb=h`
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
