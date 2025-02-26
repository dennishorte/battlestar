const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `GPS`  // Card names are unique in Innovation
  this.name = `GPS`
  this.color = `green`
  this.age = 10
  this.expansion = `echo`
  this.biscuits = `chii`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return all cards from your forecast!`,
    `Draw and foreshadow three {0}.`,
    `You may splay your yellow cards up.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'forecast'))
    },

    (game, player) => {
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 10))
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 10))
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 10))
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['yellow'], 'up')
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
