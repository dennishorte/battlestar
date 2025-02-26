const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Kim Yu-Na`  // Card names are unique in Innovation
  this.name = `Kim Yu-Na`
  this.color = `purple`
  this.age = 10
  this.expansion = `figs`
  this.biscuits = `hl&a`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = `Score a top card from your board.`
  this.karma = [
    `If you would score a card with a {k}, instead you win.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aChooseAndScore(player, game.getTopCards(player))
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, func, { card }) => card.biscuits.includes('k'),
      func: (game, player) => {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
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
