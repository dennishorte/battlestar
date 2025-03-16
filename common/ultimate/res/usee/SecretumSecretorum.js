const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Secretum Secretorum`  // Card names are unique in Innovation
  this.name = `Secretum Secretorum`
  this.color = `blue`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `shsc`
  this.dogmaBiscuit = `s`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return five cards from your hand and/or score pile. Draw two cards of value equal to the number of different colors of cards you return. Meld one of the drawn cards and score the other.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = [
        ...game.getZoneByPlayer(player, 'hand').cards(),
        ...game.getZoneByPlayer(player, 'score').cards()
      ]

      const returned = game.aChooseAndReturn(player, choices, {
        count: 5,
        title: 'Choose 5 cards to return'
      })

      const numColors = new Set(returned.map(card => card.color)).size
      const drawnCards = []

      for (let i = 0; i < 2; i++) {
        const card = game.aDraw(player, { age: numColors })
        if (card) {
          drawnCards.push(card)
        }
      }

      if (drawnCards.length > 0) {
        const melded = game.aChooseAndMeld(player, drawnCards, { count: 1 })[0]
        const toScore = drawnCards.find(card => card !== melded)
        if (toScore) {
          game.aScore(player, toScore)
        }
      }
    },
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
