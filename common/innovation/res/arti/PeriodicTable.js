const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Periodic Table`
  this.color = `blue`
  this.age = 7
  this.biscuits = `shss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Choose two top cards on your board of the same value. If you do, draw a card of value one higher and meld it. If it melded over one of the chosen cards, repeat this effect.`
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
