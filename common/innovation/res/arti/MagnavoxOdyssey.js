const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Magnavox Odyssey`  // Card names are unique in Innovation
  this.name = `Magnavox Odyssey`
  this.color = `yellow`
  this.age = 9
  this.expansion = `arti`
  this.biscuits = `slhs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and meld two {0}. If they are the same color, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card1 = game.aDrawAndMeld(player, game.getEffectAge(this, 10))
      const card2 = game.aDrawAndMeld(player, game.getEffectAge(this, 10))

      if (card1.color === card2.color) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }
      else {
        game.mLog({ template: 'Colors do not match' })
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
