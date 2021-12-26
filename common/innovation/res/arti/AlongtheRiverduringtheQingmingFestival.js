const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Along the River during the Qingming Festival`
  this.color = `yellow`
  this.age = 3
  this.biscuits = `ccch`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Draw and reveal a {4}. If it is yellow, tuck it. If it is purple, score it. Otherwise, repeat this effect.`
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
