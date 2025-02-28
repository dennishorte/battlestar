const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Green Hydrogen`  // Card names are unique in Innovation
  this.name = `Green Hydrogen`
  this.color = `green`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score all non-top green cards on your board. Draw and tuck an {11} for each card scored.`
  ]

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
