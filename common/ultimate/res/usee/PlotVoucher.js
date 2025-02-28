const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Plot Voucher`  // Card names are unique in Innovation
  this.name = `Plot Voucher`
  this.color = `green`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `sslh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your score pile. Safeguard the lowest available standard achievement. If you do, super-execute the melded card if it is your turn, or if it is not your turn self-execute it.`
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
