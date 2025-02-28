const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tomb`  // Card names are unique in Innovation
  this.name = `Tomb`
  this.color = `yellow`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `chkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Safeguard an available achievement of value equal to the number of achievements you have.`,
    `You may transfer the lowest-valued achievement to your hand. If you do, return all purple and all blue cards on your board.`
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
