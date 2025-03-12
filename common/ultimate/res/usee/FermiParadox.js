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
    `Reveal the top card of the {9} deck and the {0} deck. Return the top card of the {9} deck or the {0} deck.`,
    `If you have no cards on your board, you win. Otherwise, transfer all valued cards in the junk to your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = [
        game.getZoneByDeck('base', game.getEffectAge(this, 9)).cards()[0],
        game.getZoneByDeck('base', game.getEffectAge(this, 10)).cards()[0],
      ].filter(x => x)

      cards.forEach(card => game.mReveal(player, card))

      game.aChooseAndReturn(player, cards, {
        title: 'Choose a card to put on the bottom of its deck',
      })
    },

    (game, player) => {
      const numBoardCards = game.getTopCards(player).length

      if (numBoardCards === 0) {
        throw new GameOverEvent({
          player,
          reason: this.name,
        })
      }
      else {
        const valuedJunkCards = game
          .getZoneById('junk')
          .cards()
          .filter(card => card.age !== undefined)

        game.aTransferMany(player, valuedJunkCards, game.getZoneByPlayer(player, 'hand'), { ordered: true })
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
