const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Daedalus`
  this.color = `blue`
  this.age = 1
  this.biscuits = `&hkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {4}.`
  this.triggers = [
    `Each card in your forecast adds one to the value of your highest top card for the purpose of claiming achievements. Each achievement adds its value to your score.`
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
