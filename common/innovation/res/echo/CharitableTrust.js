const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Charitable Trust`  // Card names are unique in Innovation
  this.name = `Charitable Trust`
  this.color = `green`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `&hc3`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Draw a {3} or {4}.`
  this.karma = []
  this.dogma = [
    `You may meld the card you drew due to Charitable Trust's echo effect. If you do, either return or achieve (if eligible) your top green card.`
  ]

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
