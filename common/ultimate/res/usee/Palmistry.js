const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Palmistry`  // Card names are unique in Innovation
  this.name = `Palmistry`
  this.color = `blue`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `lkhk`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld a {1}.`,
    `Return two cards from your hand. If you do, draw and score a {2}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndMeld(player, game.getEffectAge(this, 1))
    },
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand')
      const returned = game.aChooseAndReturn(player, hand.cards(), { count: 2 })

      if (returned.length === 2) {
        game.aDrawAndScore(player, game.getEffectAge(this, 2))
      }
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
