const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Shigeru Miyamoto`  // Card names are unique in Innovation
  this.name = `Shigeru Miyamoto`
  this.color = `yellow`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `hai&`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw and reveal a {0}. If it does not have a {i}, score it.`
  this.karma = [
    `If you would take a Dogma action and activate a card whose featured biscuit is {i}, first if you have exactly one, three, or six {i} on your board, you win.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    const card = game.aDrawAndReveal(player, game.getEffectAge(this, 10))
    if (!card.checkHasBiscuit('i')) {
      game.aScore(player, card)
    }
    else {
      game.mLog({
        template: '{card} has a clock biscuit; do not score',
        args: { card }
      })
    }
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('i'),
      func: (game, player) => {
        const clocks = game.getBiscuitsByPlayer(player).i
        if (clocks === 1 || clocks === 3 || clocks === 6) {
          throw new GameOverEvent({
            player,
            reason: this.name
          })
        }
        else {
          game.mLogNoEffect()
        }
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
