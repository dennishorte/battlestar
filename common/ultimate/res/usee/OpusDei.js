const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Opus Dei`  // Card names are unique in Innovation
  this.name = `Opus Dei`
  this.color = `purple`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal the highest card in your score pile. If you do, splay your cards of the revealed card's color up, and safeguard that card.`,
    `Draw an {8} for every color on your board splayed up.`
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
