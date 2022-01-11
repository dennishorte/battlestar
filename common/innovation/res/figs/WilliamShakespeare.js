const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `William Shakespeare`  // Card names are unique in Innovation
  this.name = `William Shakespeare`
  this.color = `purple`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `4*hs`
  this.dogmaBiscuit = `s`
  this.inspire = `Meld a card from your hand.`
  this.echo = ``
  this.karma = [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each HEX on your board provides one additional point toward your score.`
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
