const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Printing Press`  // Card names are unique in Innovation
  this.name = `Printing Press`
  this.color = `blue`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `hssc`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your score pile. If you do, draw a card of value two higher than the top purple card on your board.`,
    `You may splay your blue cards right.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getZoneByPlayer(player, 'score')
        .cards()
        .map(c => c.id)
      const card = game.aChooseCard(player, choices, { min: 0, max: 1 })

      if (card) {
        game.aReturn(player, card)

        const topPurple = game
          .getZoneByPlayer(player, 'purple')
          .cards()[0]
        const drawAge = topPurple ? topPurple.age + 2 : 2
        game.aDraw(player, { age: drawAge })
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
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
