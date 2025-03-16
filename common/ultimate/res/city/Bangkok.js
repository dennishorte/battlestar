const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bangkok`  // Card names are unique in Innovation
  this.name = `Bangkok`
  this.color = `green`
  this.age = 10
  this.expansion = `city`
  this.biscuits = `icbbbh`
  this.dogmaBiscuit = `i`
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
