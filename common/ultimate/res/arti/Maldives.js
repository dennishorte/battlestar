const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Maldives`  // Card names are unique in Innovation
  this.name = `Maldives`
  this.color = `red`
  this.age = 10
  this.expansion = `arti`
  this.biscuits = `ihii`
  this.dogmaBiscuit = `i`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I compel you to return all cards in your hand but two! Return all cards in your score pile but two!`,
    `Return all cards in your score pile but four.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const hand = game.getCardsByZone(player, 'hand')
      const handCount = Math.max(0, hand.length - 2)
      game.aChooseAndReturn(player, hand, { count: handCount })

      const score = game.getCardsByZone(player, 'score')
      const scoreCount = Math.max(0, score.length - 2)
      game.aChooseAndReturn(player, score, { count: scoreCount })
    },

    (game, player) => {
      const score = game.getCardsByZone(player, 'score')
      const scoreCount = Math.max(0, score.length - 4)
      game.aChooseAndReturn(player, score, { count: scoreCount })
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
