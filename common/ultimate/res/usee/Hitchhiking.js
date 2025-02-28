const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hitchhiking`  // Card names are unique in Innovation
  this.name = `Hitchhiking`
  this.color = `green`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `fiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose another player. They transfer a card from their hand to your board. If they do, self-execute the card, with that player making all decisions and allowed to look at any card that you can.`
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
