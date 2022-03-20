const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Grace Hopper`  // Card names are unique in Innovation
  this.name = `Grace Hopper`
  this.color = `blue`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `sh9*`
  this.dogmaBiscuit = `s`
  this.inspire = `Tuck two cards from your hand.`
  this.echo = ``
  this.karma = [
    `If another player would not draw a card for sharing after a Dogma action, first draw and reveal a {a}. If it is blue, you win.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'), { count: 2 })
  }
  this.karmaImpl = [
    {
      trigger: 'no-share',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const card = game.aDraw(player, { age: game.getEffectAge(this, 10) })
        if (card && card.color === 'blue') {
          throw new GameOverEvent({
            player,
            reason: this.name
          })
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
