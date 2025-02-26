const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Railroad`  // Card names are unique in Innovation
  this.name = `Railroad`
  this.color = `purple`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `ifih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand, then draw three {6}.`,
    `You may splay up any one color of your cards current splayed right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(this, 6) })
      game.aDraw(player, { age: game.getEffectAge(this, 6) })
      game.aDraw(player, { age: game.getEffectAge(this, 6) })
    },

    (game, player) => {
      const choices = game
        .utilColors()
        .filter(color => game.getZoneByPlayer(player, color).splay === 'right')
      game.aChooseAndSplay(player, choices, 'up')
    }
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
