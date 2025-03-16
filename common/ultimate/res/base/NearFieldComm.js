const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Near-Field Comm`  // Card names are unique in Innovation
  this.name = `Near-Field Comm`
  this.color = `yellow`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `hcpp`
  this.dogmaBiscuit = `p`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all the cards of the value of my choice from your score pile to my score pile!`,
    `Reveal and self-execute the highest card in your score pile.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const value = game.aChooseAge(leader)
      game.mLog({
        template: '{leader} chooses value {value}',
        args: { leader, value }
      })

      const cardsToTransfer = game
        .getCardsByZone(player, 'score')
        .filter(card => card.getAge() === value)

      game.aTransferMany(player, cardsToTransfer, game.getZoneByPlayer(leader, 'score'))
    },

    (game, player) => {
      const scoreCards = game.getCardsByZone(player, 'score')
      if (scoreCards.length === 0) {
        game.mLogNoEffect()
        return
      }

      // Find the highest card
      const highest = Math.max(...scoreCards.map(card => card.getAge()))
      const highestCards = scoreCards.filter(card => card.getAge() === highest)

      const card = game.aChooseCard(player, highestCards)
      if (card) {
        game.mReveal(player, card)
        game.aSelfExecute(player, card)
      }
    }
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
