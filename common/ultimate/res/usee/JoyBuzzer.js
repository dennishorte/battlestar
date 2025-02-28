const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Joy Buzzer`  // Card names are unique in Innovation
  this.name = `Joy Buzzer`
  this.color = `purple`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `icih` 
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you exchange all cards in your hand with all the lowest cards in my hand!`,
    `You may choose a value and score all the cards in your hand of that value. If you do, score your top purple card.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const playerHand = game.getZoneByPlayer(player, 'hand')
      const leaderHand = game.getZoneByPlayer(leader, 'hand')
      
      const playerCards = playerHand.cards()
      const leaderLowest = game.utilLowestCards(leaderHand.cards())
      
      game.aTransferMany(player, playerCards, leaderHand)
      game.aTransferMany(leader, leaderLowest, playerHand)
    },
    (game, player) => {
      const hand = game.getZoneByPlayer(player, 'hand').cards()
      const ages = hand.map(c => c.age).filter((v, i, a) => a.indexOf(v) === i)

      const age = game.aChooseAge(
        player, 
        ages, 
        {
          title: 'Choose a value to score from hand'
        }
      ) 

      if (age) {
        const cardsOfAge = hand.filter(c => c.age === age)
        cardsOfAge.forEach(card => game.aScore(player, card))

        const topPurple = game.getTopCard(player, 'purple')
        if (topPurple) {
          game.aScore(player, topPurple)
        }
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