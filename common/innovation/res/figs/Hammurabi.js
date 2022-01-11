const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hammurabi`  // Card names are unique in Innovation
  this.name = `Hammurabi`
  this.color = `red`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `s*h2`
  this.dogmaBiscuit = `s`
  this.inspire = `Meld a card from your hand.`
  this.echo = ``
  this.karma = [
    `If a player would successfully demand something of you, first successfully demand that same thing of that player.`
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
