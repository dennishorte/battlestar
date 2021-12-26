const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Amina Sukhera`
  this.color = `red`
  this.age = 4
  this.biscuits = `f*fh`
  this.dogmaBiscuit = `f`
  this.inspire = `Score all bottom purple cards.`
  this.echo = ``
  this.triggers = [
    `When you meld this card, score all opponents' top figures of value 4.`,
    `Each top card with a {k} on your board counts as an available achievement for you.`
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