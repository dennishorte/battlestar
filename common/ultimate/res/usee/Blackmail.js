const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Blackmail`  // Card names are unique in Innovation
  this.name = `Blackmail`
  this.color = `green`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hffl`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you reveal your hand! Meld a revealed card of my choice! Reveal your score pile! Self-execute a card revealed due to this effect of my choice, replacing 'may' with 'must'!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      // Reveal opponent's hand
      const opponentHand = game.getZoneByPlayer(player, 'hand').cards()
      game.mReveal(player, opponentHand)
      
      // Leader chooses a card to meld
      const meldChoice = game.aChooseCard(leader, opponentHand, { 
        title: 'Choose a card for opponent to meld'
      })
      if (meldChoice) {
        game.aMeld(player, meldChoice)
      }

      // Reveal opponent's score pile  
      const opponentScore = game.getZoneByPlayer(player, 'score').cards()
      game.mReveal(player, opponentScore)

      // Leader picks a revealed card to self-execute
      const revealedCards = [...opponentHand, ...opponentScore] 
      const executeChoice = game.aChooseCard(leader, revealedCards, {
        title: 'Choose a card to self-execute'
      })
      if (executeChoice) {
        game.mLog({
          template: '{player} must self-execute {card}',
          args: { player, card: executeChoice }
        })
        for (const dogmaImpl of executeChoice.dogmaImpl) {
          dogmaImpl(game, player)
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