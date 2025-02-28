const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Padlock`  // Card names are unique in Innovation
  this.name = `Padlock`
  this.color = `red`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `ckhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer one of your secrets to the available achievements!`,
    `If no card was transferred due to the demand, you may score up to three cards from your hand of different values.`
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
