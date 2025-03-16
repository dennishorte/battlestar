const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Seoul`  // Card names are unique in Innovation
  this.name = `Seoul`
  this.color = `red`
  this.age = 10
  this.expansion = `city`
  this.biscuits = `pp^p=h`
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
