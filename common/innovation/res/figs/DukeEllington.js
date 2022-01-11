const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Duke Ellington`  // Card names are unique in Innovation
  this.name = `Duke Ellington`
  this.color = `purple`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `s9*h`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw and meld an {8} figure.`
  this.echo = ``
  this.karma = [
    `If you are required to fade a figure, instead do nothing.`,
    `If you would meld a figure and have four top figures already, instead achieve it regardless of eligibility.`
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
