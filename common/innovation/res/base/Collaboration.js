const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `Collaboration`  // Card names are unique in Innovation
  this.name = `Collaboration`
  this.color = `green`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hcic`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw two {9} and reveal them! Transfer the card of my choice to my board, and meld the other!`,
    `If you have ten or more green cards on your board, you win.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const card1 = game.aDrawAndReveal(player, game.getEffectAge(this, 9) )
      const card2 = game.aDrawAndReveal(player, game.getEffectAge(this, 9) )

      const chosen = game.aChooseCard(leader, [card1, card2])
      const other = chosen === card1 ? card2 : card1

      game.aTransfer(player, chosen, game.getZoneByPlayer(leader, chosen.color))
      game.aMeld(player, other)
    },

    (game, player) => {
      const greenCount = game
        .getZoneByPlayer(player, 'green')
        .cards()
        .length

      if (greenCount >= 10) {
        throw new GameOverEvent({
          player,
          reason: 'Collaboration'
        })
      }
      else {
        game.mLogNoEffect()
      }
    },
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
