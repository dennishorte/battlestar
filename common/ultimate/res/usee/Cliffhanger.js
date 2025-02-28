const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cliffhanger`  // Card names are unique in Innovation
  this.name = `Cliffhanger`
  this.color = `green`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `sllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal a {3} in your safe. If it is: green, tuck it; purple, meld it; red, achieve it regardless of eligibility; yellow, score it; blue, draw a {3}. Otherwise, safeguard the top card of the {3} deck.`
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
