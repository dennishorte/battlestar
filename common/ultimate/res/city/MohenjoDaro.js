const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mohenjo-Daro`  // Card names are unique in Innovation
  this.name = `Mohenjo-Daro`
  this.color = `purple`
  this.age = 1
  this.expansion = `city`
  this.biscuits = `lllk+h`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = []

  this.dogmaImpl = [
    (game, player) => {

    },
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
