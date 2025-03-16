const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Escape Room`  // Card names are unique in Innovation
  this.name = `Escape Room`
  this.color = `yellow`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `icih`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw, reveal, and score an {e}! Score a card from your hand of the same color as the drawn card! If you don't, you lose!`,
    `Score four top non-yellow cards each with {i} of different colors on your board.`
  ]

  this.dogmaImpl = [
    (game, player, { self }) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 11))
      if (card) {
        game.aScore(player, card)
        const choices = game
          .getCardsByZone(player, 'hand')
          .filter(c => c.color === card.color)

        const scored = game.aChooseAndScore(player, choices)[0]
        if (!scored) {
          game.aYouLose(player, self)
        }
      }
    },
    (game, player) => {
      const toScore = game
        .getTopCards(player)
        .filter(c => c.color !== 'yellow')
        .filter(c => c.checkHasBiscuit('i'))

      game.aScoreMany(player, toScore)
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
