const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../../lib/game.js')

function Card() {
  this.id = `Fermi Paradox`  // Card names are unique in Innovation
  this.name = `Fermi Paradox`
  this.color = `blue`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hiis` 
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal the top card of the {9} deck and the {10} deck. Return the top card of the {9} deck or the {10} deck.`,
    `If you have no cards on your board, you win. Otherwise, transfer all valued cards in the junk to your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const age9Card = game.aReveal(player, game.getZoneById('deck9').cards().slice(-1)[0])
      const age10Card = game.aReveal(player, game.getZoneById('deck10').cards().slice(-1)[0])

      const cardsToChoose = [age9Card, age10Card].filter(card => card !== undefined)
      const cardToReturn = game.aChooseAndReturn(player, cardsToChoose)[0]
      
      game.mLog({
        template: '{player} returned {card}',
        args: { player, card: cardToReturn }
      })
    },

    (game, player) => {
      const numBoardCards = game
        .getPlayerBoard(player)
        .flatMap(stack => stack.cards())
        .length

      if (numBoardCards === 0) {
        throw new GameOverEvent({
          player, 
          reason: 'Fermi Paradox'
        })
      }
      else {
        const valuedJunkCards = game
          .getZoneById('junk')
          .cards()
          .filter(card => card.age > 0)

        game.aTransferMany(player, valuedJunkCards, game.getZoneByPlayer(player, 'hand'))
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