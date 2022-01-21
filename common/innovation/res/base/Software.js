const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Software`  // Card names are unique in Innovation
  this.name = `Software`
  this.color = `blue`
  this.age = 10
  this.expansion = `base`
  this.biscuits = `iiih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and score a {0}.`,
    `Draw and meld two {0}, then execute each of the second card's non-demand dogma effects. Do not share them.`
  ]

  this.dogmaImpl = [
    {
      dogma: `Draw and score a {0}.`,
      steps: [
        {
          description: `Draw and score a {0}.`,
          func(context, player) {
            const { game } = context
            return game.aDrawAndScore(context, player, 10)
          }
        }
      ]
    },
    {
      dogma: `Draw and meld two {0}, then execute each of the second card's non-demand dogma effects. Do not share them.`,
      steps: [
        {
          description: 'Draw and meld first {0}',
          func(context, player) {
            const { game } = context
            return game.aDrawAndMeld(context, player, 10)
          }
        },
        {
          description: 'Draw and meld second {0}',
          func(context, player) {
            const { game } = context
            return game.aDrawAndMeld(context, player, 10)
          }
        },
        {
          description: `Execute each of the second card's non-demand dogma effects. Do not share them.`,
          func(context, player) {
            const { game } = context
            const cardToExecute = context.sentBack.card
            return game.aExecute(context, player, cardToExecute)
          }
        },
      ]
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
