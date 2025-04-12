const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Chintz`  // Card names are unique in Innovation
  this.name = `Chintz`
  this.color = `green`
  this.age = 4
  this.expansion = `echo`
  this.biscuits = `chc4`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw a {4}.`,
    `If you have exactly one card in your hand, draw a {4}, then draw and score a {4}.`,
    `If Chintz was foreseen, transfer all cards from your hand to the available achievements.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 4) })
    },

    (game, player) => {
      if (game.getCardsByZone(player, 'hand').length === 1) {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
        game.aDrawAndScore(player, game.getEffectAge(this, 4))
      }
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)
        const hand = game.getCardsByZone(player, 'hand')
        game.aTransferMany(player, hand, game.getZoneById('achievements'), { ordered: true })
      }
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
