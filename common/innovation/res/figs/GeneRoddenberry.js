const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Gene Roddenberry`  // Card names are unique in Innovation
  this.name = `Gene Roddenberry`
  this.color = `purple`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `ch&9`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = `Meld a top purple card from anywhere.`
  this.karma = [
    `If you would meld a purple card, instead if it is Enterprise, you win. Otherwise, instead tuck the card and return any top figure.`
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
