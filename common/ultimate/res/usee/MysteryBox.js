const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mystery Box`  // Card names are unique in Innovation
  this.name = `Mystery Box`
  this.color = `green`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Claim an available standard achievement, regardless of eligibility. Self-execute it.`
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
