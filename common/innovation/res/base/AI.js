const CardBase = require(`../CardBase.js`)
const { GameOverEvent } = require('../../game.js')

function Card() {
  this.id = `A.I.`  // Card names are unique in Innovation
  this.name = `A.I.`
  this.color = `purple`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `ssih`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score a {0}.`,
    `If Robotics and Software are top cards on any board, the single player with the lowest score wins.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndScore(player, game.getEffectAge(this, 10))
    },
    (game, player) => {
      const conditionMet  = game
        .getPlayerAll()
        .flatMap(player => game.getTopCards(player))
        .filter(card => card.name === 'Robotics' || card.name === 'Software')
        .length === 2

      if (conditionMet) {
        const playerScores = game
          .getPlayerAll()
          .map(player => ({ player, score: game.getScore(player) }))
          .sort((l, r) => l.score - r.score)

        if (playerScores[0].score < playerScores[1].score) {
          throw new GameOverEvent({
            reason: 'A.I.',
            player: playerScores[0].player,
          })
        }
        else {
          game.mLogNoEffect()
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
