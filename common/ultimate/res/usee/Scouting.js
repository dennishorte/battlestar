const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Scouting`  // Card names are unique in Innovation
  this.name = `Scouting`
  this.color = `blue`
  this.age = 8
  this.expansion = `usee`
  this.biscuits = `lssh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal two {8}. Return at least one of the drawn cards. If you return two, reveal the top card of the {10} deck. If the color of the revealed card matches the color of at least one of the returned cards, draw a {10}.`
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
