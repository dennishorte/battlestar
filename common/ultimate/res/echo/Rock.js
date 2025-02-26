const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Rock`  // Card names are unique in Innovation
  this.name = `Rock`
  this.color = `purple`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `l9hl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer your top green card to my hand! If Scissors is your new top green card, I win!`,
    `You may score a top card from your board. If Paper is your top green card, you win.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const card = game.getTopCard(player, 'green')
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, 'hand'))

        const next = game.getTopCard(player, 'green')
        if (next && next.name === 'Scissors') {
          throw new GameOverEvent({
            player: leader,
            reason: this.name
          })
        }
      }
    },

    (game, player) => {
      game.aChooseAndScore(player, game.getTopCards(player), { min: 0, max: 1 })

      const card = game.getTopCard(player, 'green')
      if (card && card.name === 'Paper') {
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
