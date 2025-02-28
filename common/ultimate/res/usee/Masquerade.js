const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Masquerade`  // Card names are unique in Innovation
  this.name = `Masquerade`
  this.color = `purple`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `cchk`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Safeguard an available achievement of value equal to the number of cards in your hand. If you do, return all cards of that value from your hand. If you return a {3}, claim the Anonymity achievement.`,
    `You may splay your purple cards left.`
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
