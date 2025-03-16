const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tikal`  // Card names are unique in Innovation
  this.name = `Tikal`
  this.color = `red`
  this.age = 2
  this.expansion = `city`
  this.biscuits = `kl4kkh`
  this.dogmaBiscuit = `k`
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
