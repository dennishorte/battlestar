const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Red Envelope`  // Card names are unique in Innovation
  this.name = `Red Envelope`
  this.color = `red`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `lchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a value at which you have exactly two or three cards altogether in your hand and score pile. Transfer those cards to the score pile of the player on your right.`,
    `You may score exactly two or three cards from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const handAndScore = game.getZoneByPlayer(player, 'hand').cards().concat(game.getZoneByPlayer(player, 'score').cards())
      const cardCounts = handAndScore.reduce((counts, card) => {
        counts[card.age] = (counts[card.age] || 0) + 1
        return counts
      }, {})

      const eligibleAges = Object.entries(cardCounts)
        .filter(([age, count]) => count === 2 || count === 3)
        .map(([age]) => parseInt(age))

      if (eligibleAges.length === 0) {
        game.mLogNoEffect()
        return
      }

      const age = game.aChooseAge(player, eligibleAges)
      
      const transferCards = handAndScore.filter(card => card.age === age)
      const nextPlayer = game.getNextPlayer(player)
      game.aTransferMany(player, transferCards, game.getZoneByPlayer(nextPlayer, 'score'))
    },
    (game, player) => {
      const choices = game.getZoneByPlayer(player, 'hand').cards()
      game.aChooseAndScore(player, choices, { count: 2, max: 3 })
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