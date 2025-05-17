const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Charles Darwin`  // Card names are unique in Innovation
  this.name = `Charles Darwin`
  this.color = `blue`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `&8hs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw an {8}.`
  this.karma = [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would claim an achievement, first if no other player has as many or more achievements as you, instead you win.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 8) })
  }
  this.inspireImpl = []
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const sorted = game
          .players.all()
          .map(player => ({ player, count: game.getAchievementsByPlayer(player).total }))
          .sort((l, r) => r.count - l.count)

        const mostCondition = sorted[0].player === player
        const exclusiveCondition = sorted[0].count > sorted[1].count

        if (mostCondition && exclusiveCondition) {
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
