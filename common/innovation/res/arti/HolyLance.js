const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Holy Lance`  // Card names are unique in Innovation
  this.name = `Holy Lance`
  this.color = `purple`
  this.age = 2
  this.expansion = `arti`
  this.biscuits = `klhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to transfer a top Artifact from your board to my board!`,
    `If Holy Grail is a top card on your board, you win.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.expansion === 'arti')
      const card = game.aChooseCard(player, choices)
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
      }
    },

    (game, player) => {
      const grailIsTop = game
        .getTopCards(player)
        .filter(card => card.name === 'Holy Grail')
        .length > 0

      if (grailIsTop) {
        throw new GameOverEvent({
          player,
          reason: this.name
        })
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
