const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Karaoke`  // Card names are unique in Innovation
  this.name = `Karaoke`
  this.color = `purple`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `hl9&`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Draw and meld a card of value less than {0}.`
  this.karma = []
  this.dogma = [
    `Execute all of the non-demand dogma effects of the card you melded due to Karaoke's echo effect. Do not share them.`,
    `You may take a bottom card from your board into your hand.`
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
