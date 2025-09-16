const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Syncom 3`  // Card names are unique in Innovation
  this.name = `Syncom 3`
  this.color = `green`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `hiii`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return all cards from your hand. Draw and reveal five {9}. If you revealed all five colors, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      const drawn = [
        game.aDrawAndReveal(player, game.getEffectAge(this, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 9)),
        game.aDrawAndReveal(player, game.getEffectAge(this, 9)),
      ].filter(card => card !== undefined)

      const colors = drawn.map(card => card.color)
      const colorCount = util.array.distinct(colors).length
      game.mLog({ template: `Player drew ${colorCount} colors`})
      if (colorCount === 5) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
    }
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
