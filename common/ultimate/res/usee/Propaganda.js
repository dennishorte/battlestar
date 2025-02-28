const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Propaganda`  // Card names are unique in Innovation
  this.name = `Propaganda`
  this.color = `purple`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `chkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you meld a card of the color of my choice from your hand! If you do, transfer the card beneath it to my board!`,
    `Meld a card from your hand.`
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
