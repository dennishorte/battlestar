const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Pele`
  this.color = `purple`
  this.age = 9
  this.biscuits = `ha*c`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw and tuck three {9}.`
  this.echo = ``
  this.triggers = [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would tuck a yellow card after tucking a green card in the same turn, instead you win.`
  ]
  this.dogma = []

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
