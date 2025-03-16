const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Brisbane`  // Card names are unique in Innovation
  this.name = `Brisbane`
  this.color = `purple`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `pbblbh`
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
