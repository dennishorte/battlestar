const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Teleprompter`  // Card names are unique in Innovation
  this.name = `Teleprompter`
  this.color = `green`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `liih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal the top card of any value deck from any set. Execute the first sentence of non-demand dogma effect on the card. If you do, return the revealed card and repeat this effect using the next sentence.`
  ]

  this.dogmaImpl = [
    (game, player) => {

    },
  ]
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
