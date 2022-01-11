const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Emperor Meiji`  // Card names are unique in Innovation
  this.name = `Emperor Meiji`
  this.color = `purple`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `hii*`
  this.dogmaBiscuit = `i`
  this.inspire = `Draw and foreshadow an {8} or {9}.`
  this.echo = ``
  this.karma = [
    `If you would meld a card of value 10 and you have top cards of values 9 and 8 on your board, instead you win.`,
    `Each card in your forecast counts as being in your hand.`
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
