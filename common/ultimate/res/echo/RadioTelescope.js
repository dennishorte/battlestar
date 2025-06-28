const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Radio Telescope`  // Card names are unique in Innovation
  this.name = `Radio Telescope`
  this.color = `blue`
  this.age = 8
  this.expansion = `echo`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `For every two {s} on your board, draw a {9}. Meld one of the cards drawn and return the rest. If you meld AI due to this dogma effect, you win.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const count = Math.floor(game.getBiscuitsByPlayer(player).s / 2)
      const drawn = []
      for (let i = 0; i < count; i++) {
        const card = game.aDraw(player, { age: game.getEffectAge(this, 9) })
        if (card) {
          drawn.push(card)
        }
      }

      const melded = game.aChooseAndMeld(player, drawn)

      if (melded.length > 0 && melded[0].name === 'A.I.') {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
      }

      const toReturn = drawn.filter(card => card !== melded[0])
      game.aReturnMany(player, toReturn)
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
