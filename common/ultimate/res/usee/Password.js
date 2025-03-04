const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Password`  // Card names are unique in Innovation
  this.name = `Password`
  this.color = `red`
  this.age = 2
  this.expansion = `usee` // verified against image
  this.biscuits = `hckk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {2}. You may safeguard another card from your hand of the color of the drawn card. If you do, score the drawn card. Otherwise, return all cards from your hand except the drawn card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const drawnCard = game.aDrawAndReveal(player, game.getEffectAge(this, 2))

      const otherHandCards = game
        .getCardsByZone(player, 'hand')
        .filter(c => c.name !== drawnCard.name)
      const sameColorCards = otherHandCards.filter(c => c.color === drawnCard.color)

      const safeguarded = game.aChooseAndSafeguard(player, sameColorCards, {
        title: 'Choose a card to safeguard',
        min: 0,
        max: 1
      })[0]

      if (safeguarded) {
        game.mLog({
          template: '{player} safeguards {card}',
          args: { player, card: safeguarded }
        })
        game.aScore(player, drawnCard)
      }
      else {
        game.aReturnMany(player, otherHandCards)
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
