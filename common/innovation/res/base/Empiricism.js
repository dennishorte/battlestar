const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Empiricism`
  this.color = `purple`
  this.age = 8
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Choose two colors, then draw and reveal a {9}. If it is either of the colors you chose, meld it and your may splay your cards of that color up.`,
    `If you have twenty or more {s} on your board, you win.`
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