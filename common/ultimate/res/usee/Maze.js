const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Maze`  // Card names are unique in Innovation
  this.name = `Maze`
  this.color = `red`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you score a card from your hand of matching color for each card in my hand. If you don't, and I turn a card in my hand, I'll exchange all cards in your hand with all cards in my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const leaderHandSize = game.getCardsByZone(leader, 'hand').length
      const matchingColorCards = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === this.color)

      const scoredCards = game.aChooseAndScore(player, matchingColorCards, { max: leaderHandSize })
      
      if (scoredCards.length < leaderHandSize) {
        const leaderHandCard = game.aChooseCard(leader, game.getCardsByZone(leader, 'hand'), { title: 'Choose a card to tuck' })
        if (leaderHandCard) {
          game.aTuck(leader, leaderHandCard)
          
          const playerHand = game.getCardsByZone(player, 'hand')
          const playerScore = game.getCardsByZone(player, 'score')

          game.aTransferMany(player, playerHand, game.getZoneByPlayer(player, 'score'), { ordered: true })
          game.aTransferMany(player, playerScore, game.getZoneByPlayer(player, 'hand'), { ordered: true })
        }
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