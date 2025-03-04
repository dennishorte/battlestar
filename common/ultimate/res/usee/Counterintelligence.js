const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Counterintelligence`  // Card names are unique in Innovation
  this.name = `Counterintelligence`
  this.color = `blue`
  this.age = 7
  this.expansion = `usee` // Corrected expansion
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you tuck a top card on your board with {i}! If you do, transfer your top card of color matching the tucked card to my board, and draw a {7}!`,
    `Draw an {8}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('i'))

      const tuckedCard = game.aChooseAndTuck(player, choices, { min: 1, max: 1 })[0]

      if (tuckedCard) {
        const matchingCard = game
          .getTopCards(player)
          .filter(card => card.color === tuckedCard.color)[0]

        if (matchingCard) {
          game.aTransfer(player, matchingCard, game.getZoneByPlayer(leader, matchingCard.color))
          game.aDraw(player, { age: game.getEffectAge(this, 7) })
        }
      }
    },
    (game, player) => {
      game.aDraw(player, { age: game.getEffectAge(this, 8) })
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