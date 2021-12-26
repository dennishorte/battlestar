const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Nelson Mandela`
  this.color = `red`
  this.age = 9
  this.biscuits = `l*hl`
  this.dogmaBiscuit = `l`
  this.inspire = `Draw and meld a {9}.`
  this.echo = ``
  this.triggers = [
    `If you are required to fade a figure, instead do nothing.`,
    `Each two inspire effects visibile on your board counts as an achievement.`
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
