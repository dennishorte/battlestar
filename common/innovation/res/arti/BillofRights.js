const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Bill of Rights`
  this.color = `red`
  this.age = 5
  this.biscuits = `hlss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `I compel you to choose a color where you have more visible cards than I do! Transfer all cards of that color from your board to my board, from the bottom up.`
  ]

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.triggerImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
