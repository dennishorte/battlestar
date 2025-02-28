const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Placebo`  // Card names are unique in Innovation
  this.name = `Placebo`
  this.color = `blue`
  this.age = 6
  this.expansion = `usee`
  this.biscuits = `ssfh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a top card on your board, then you may repeat as many times as you want with the same color. Draw a {6} for each card you return. If you return exactly one {6}, draw an {8}.`
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
