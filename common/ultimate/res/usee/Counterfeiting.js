const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Counterfeiting`  // Card names are unique in Innovation
  this.name = `Counterfeiting`
  this.color = `green`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `scch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score a top card from your board of a value not in your score pile. If you do, repeat this effect.`,
    `You may splay your green or purple cards left.`
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
