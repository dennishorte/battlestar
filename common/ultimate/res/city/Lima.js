const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Lima`  // Card names are unique in Innovation
  this.name = `Lima`
  this.color = `purple`
  this.age = 11
  this.expansion = `city`
  this.biscuits = `slbs=h`
  this.dogmaBiscuit = `s`
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
