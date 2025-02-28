const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Taqiyya`  // Card names are unique in Innovation
  this.name = `Taqiyya`
  this.color = `purple`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `slhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color. Transfer all cards of that color on your board into your hand.`,
    `Draw and meld a {3}. If the melded card is a bottom card on your board, score it and any number of cards of its color in your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const color = game.aChooseColor(player)
      const toTransfer = game
        .getCardsByZone(player, color)

      game.aTransferMany(player, toTransfer, game.getZoneByPlayer(player, 'hand'))
    },
    (game, player) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(this, 3))

      if (game.getBottomCards(player).includes(card)) {
        game.aScore(player, card)

        const sameColorInHand = game
          .getCardsByZone(player, 'hand')
          .filter(c => c.color === card.color)

        game.aChooseAndScore(player, sameColorInHand, { min: 0, max: sameColorInHand.length })
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