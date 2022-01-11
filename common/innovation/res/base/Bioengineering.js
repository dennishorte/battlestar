const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bioengineering`  // Card names are unique in Innovation
  this.name = `Bioengineering`
  this.color = `blue`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `siih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Transfer a top card with a {l} from any opponent's board to your score pile.`,
    `If any player has fewer than three {l} on their board, the player with the most {l} on their board wins.`
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
