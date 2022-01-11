const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Peter the Great`  // Card names are unique in Innovation
  this.name = `Peter the Great`
  this.color = `red`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `f*5h`
  this.dogmaBiscuit = `f`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `When you meld this card, return all opponents' top figures.`,
    `If you would tuck a card with a {f}, first achieve your bottom green card, if elibible. Otherwise, score it.`
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
