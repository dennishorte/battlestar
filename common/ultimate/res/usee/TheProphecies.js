const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Prophecies`  // Card names are unique in Innovation
  this.name = `The Prophecies`
  this.color = `blue`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either draw and safeguard a {4}, or draw and score a card of value one higher than one of your secrets. If you reveal a red or purple secret, meld one of your other secrets. If you do, safeguard the drawn card.`
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
