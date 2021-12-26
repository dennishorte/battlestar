const CardBase = require(`../CardBase.js`)

function Card() {
  this.name = `Molasses Reef Caravel`
  this.color = `green`
  this.age = 4
  this.biscuits = `sssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.triggers = []
  this.dogma = [
    `Return all cards from your hand. Draw three {4}. Meld a blue card from your hand. Score a card from your hand. Return a card from your score pile.`
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
