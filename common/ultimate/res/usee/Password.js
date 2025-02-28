const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Password`  // Card names are unique in Innovation
  this.name = `Password`
  this.color = `red`
  this.age = 2
  this.expansion = `base` // verified against image
  this.biscuits = `hckk`
  this.dogmaBiscuit = `p`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a [2]. You may safeguard another card from your hand of the color of the drawn card. If you do, score the drawn card. Otherwise, return all cards from your hand except the drawn card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const drawnCard = game.aDrawAndReveal(player, game.getEffectAge(this, 2))
      
      const handCards = game.getZoneByPlayer(player, 'hand').cards()
      const sameColorCards = handCards.filter(c => c.color === drawnCard.color)
      
      if (sameColorCards.length > 0) {
        const safeguarded = game.aChooseCard(player, sameColorCards, {
          title: 'Choose a card to safeguard',
          min: 0,
          max: 1
        })
        
        if (safeguarded) {
          game.mLog({
            template: '{player} safeguards {card}',
            args: { player, card: safeguarded }
          })
          game.aScore(player, drawnCard)
        } else {
          const toReturn = handCards.filter(c => c.id !== drawnCard.id)
          game.aReturnMany(player, toReturn)
        }
      } else {
        // No cards of same color, return all but drawn card
        const toReturn = handCards.filter(c => c.id !== drawnCard.id) 
        game.aReturnMany(player, toReturn)
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