const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Coal`  // Card names are unique in Innovation
  this.name = `Coal`
  this.color = `red`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck a {5}.`,
    `You may splay your red cards right.`,
    `You may choose a color. If you do, score your top card, twice.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndTuck(player, game.getEffectAge(this, 5))
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'right')
    },

    (game, player) => {
      const validColors = game.getTopCards(player).map(c => c.color)
      const color = game.actions.choose(player, validColors, {
        title: 'Choose a color to score, twice',
        min: 0,
        max: 1,
      })[0]

      if (color) {
        for (let i = 0; i < 2; i++) {
          const toScore = game.getCardsByZone(player, color)[0]
          if (toScore) {
            game.aScore(player, toScore)
          }
        }
      }
      else {
        game.log.addDoNothing(player)
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
