const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `3D Printing`  // Card names are unique in Innovation
  this.name = `3D Printing`
  this.color = `purple`
  this.age = 10
  this.expansion = `usee`
  this.biscuits = `siih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a top or bottom card on your board. Achieve one of your secrets of value equal to the returned card regardless of eligibility, then safeguard an available standard achievement. If you do, repeat this effect.`
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
