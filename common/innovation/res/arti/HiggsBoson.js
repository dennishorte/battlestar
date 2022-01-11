const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Higgs Boson`  // Card names are unique in Innovation
  this.name = `Higgs Boson`
  this.color = `blue`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer all cards on your board to your score pile.`
  ]

  this.dogmaImpl = []
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
