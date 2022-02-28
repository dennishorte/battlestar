const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Pele`  // Card names are unique in Innovation
  this.name = `Pele`
  this.color = `purple`
  this.age = 9
  this.expansion = `figs`
  this.biscuits = `ha*c`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw and tuck three {9}.`
  this.echo = ``
  this.karma = [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would tuck a yellow card after tucking a green card in the same turn, instead you win.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndTuck(player, game.getEffectAge(this, 9))
    game.aDrawAndTuck(player, game.getEffectAge(this, 9))
    game.aDrawAndTuck(player, game.getEffectAge(this, 9))
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'tuck',
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const greenCondition = game.state.tuckedGreenForPele.includes(player)
        const yellowCondition = card.color === 'yellow'
        return greenCondition && yellowCondition
      },
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
