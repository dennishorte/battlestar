const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Su Song`  // Card names are unique in Innovation
  this.name = `Su Song`
  this.color = `green`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `c*h3`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw and meld a {3}. If it has a {l}, repeat this effect.`
  this.echo = ``
  this.karma = [
    `You may issue a Trade Decree with any two figures.`,
    `If you would draw a {3}, first transfer a card from your score pile to your forecast.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
