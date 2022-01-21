const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bangle`  // Card names are unique in Innovation
  this.name = `Bangle`
  this.color = `red`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `hk&1`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = `Tuck a red card from your hand.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a {2}.`
  ]

  this.dogmaImpl = [
    {
      dogma: `Draw and foreshadow a {2}.`,
      steps: [
        {
          description: `Draw and foreshadow a {2}.`,
          func(context, player) {
            const { game } = context
            return game.aDrawAndForecast(context, player, 2)
          }
        }
      ]
    }
  ]
  this.echoImpl = [
    {
      dogma: `Tuck a red card from your hand.`,
      steps: [
        {
          description: `Tuck a red card from your hand.`,
          func(context, player) {
            const { game } = context
            const choices = game
              .getHand(player)
              .cards
              .map(game.getCardData)
              .filter(c => c.color === 'red')
              .map(c => c.id)

            return game.aChooseAndTuck(context, {
              playerName: player.name,
              kind: 'Card',
              choices,
              count: 1
            })
          }
        }
      ]
    }
  ]
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
