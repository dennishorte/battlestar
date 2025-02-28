const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Blackmail`  // Card names are unique in Innovation
  this.name = `Blackmail`
  this.color = `green`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hffl`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal your hand! Meld a revealed card of my choice! Reveal your score pile! Self-execute a card revealed due to this effect of my choice, replacing 'may' with 'must'!`
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
