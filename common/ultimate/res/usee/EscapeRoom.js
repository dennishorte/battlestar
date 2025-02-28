const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Escape Room`  // Card names are unique in Innovation
  this.name = `Escape Room`
  this.color = `yellow`
  this.age = 11
  this.expansion = `usee`
  this.biscuits = `icih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw, reveal, and score an {11}! Score a card from your hand of the same color as the drawn card! If you don't, you lose!`,
    `Score four top non-yellow cards each with {l} of different colors on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 11))
      if (card) {
        game.aScore(player, card)
        const choices = game.getCardsByZone(player, 'hand').filter(c => c.color === card.color)
        const scored = game.aChooseAndScore(player, choices, { min: 1, max: 1 })
        if (scored.length === 0) {
          game.mLogNoEffect()
          throw new GameOverEvent({
            player: player,
            reason: this.name
          })
        }
      }
    },
    (game, player) => {
      const colors = game.utilColors().filter(c => c !== 'yellow')
      let count = 0
      colors.forEach(color => {
        const choices = game.getTopCards(player).filter(c => c.color === color && c.checkHasBiscuit('l'))
        count += game.aChooseAndScore(player, choices, { min: 0, max: 1 }).length
      })
      if (count !== 4) {
        game.mLogNoEffect()
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