const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Encyclopedia`
  this.color = `blue`
  this.age = 6
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `You may meld all the highest cards in your score pile. If you meld one of the highest, you must meld all of the highest.`
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
