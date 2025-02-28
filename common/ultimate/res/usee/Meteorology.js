const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Meteorology`  // Card names are unique in Innovation
  this.name = `Meteorology`
  this.color = `blue`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `sslh`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a [2]. If it has [l], score it. Otherwise, if it has [c], return it and draw two [2]. Otherwise, tuck it.`,
    `If you have no [l], claim the Zen achievement.`
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
