const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Black Market`  // Card names are unique in Innovation
  this.name = `Black Market`
  this.color = `green`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `hcfc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may safeguard a card from your hand. If you do, reveal two available standard achievements. You may meld a revealed card with no {k} or {l}. Return each revealed card you do not meld.`
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
