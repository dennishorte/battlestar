const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Witch Trial`  // Card names are unique in Innovation
  this.name = `Witch Trial`
  this.color = `red`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `fffh`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal a {5}! Return your top card of the color of the drawn card, another card of that color from your hand, and a card from your score pile! If you do, repeat this effect!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const effectAge = game.getEffectAge(this, 5)

      while (true) {
        const drawnCard = game.aDrawAndReveal(player, effectAge)
        const returnColor = drawnCard.color

        const topCard = game.getTopCard(player, returnColor)
        if (topCard) {
          game.aReturn(player, topCard)
        }

        const handCards = game
          .getCardsByZone(player, 'hand')
          .filter(c => c.id !== drawnCard.id)
          .filter(c => c.color === returnColor)

        const handCard = game.aChooseAndReturn(player, handCards)[0]
        const scoreCard = game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'))[0]

        const cardsReturned = [topCard, handCard, scoreCard].filter(c => c)
        const didReturn = cardsReturned.length === 3

        if (didReturn) {
          game.mLog({
            template: '{player} returned a top card, hand card, and score card. Repeating the dogma effect.',
            args: { player }
          })
          continue
        }
        else {
          game.mLog({
            template: '{player} did not return all three required cards. Ending the dogma effect.',
            args: { player }
          })
          break
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
