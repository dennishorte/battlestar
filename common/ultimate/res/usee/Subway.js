const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Subway`  // Card names are unique in Innovation
  this.name = `Subway`
  this.color = `yellow`
  this.age = 7
  this.expansion = `usee`
  this.biscuits = `liih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck a {7}. If you have at least seven visible cards on your board of the color of the tucked card, draw a {9}. Otherwise, junk all cards on your board of that color, and draw an {8}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndTuck(player, game.getEffectAge(this, 7))

      const visibleCards = game.getVisibleCardsByZone(player, card.color)

      if (visibleCards >= 7) {
        game.aDraw(player, { age: game.getEffectAge(this, 9) })
      }
      else {
        game.aJunkMany(player, game.getCardsByZone(player, card.color), { ordered: true })
        game.aDraw(player, { age: game.getEffectAge(this, 8) })
      }
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
