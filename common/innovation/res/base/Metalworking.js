const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Metalworking`  // Card names are unique in Innovation
  this.name = `Metalworking`
  this.color = `red`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kkhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {1}. If it has a {k}, score it and repeat this dogma effect. Otherwise, keep it.`
  ]

  this.dogmaImpl = [
    {
      dogma: `Draw and reveal a {1}. If it has a {k}, score it and repeat this dogma effect. Otherwise, keep it.`,
      steps: [
        {
          description: 'Draw and reveal a {1}.',
          func(context, player) {
            const { game } = context
            return game.aDraw(context, player, 1, true)
          }
        },
        {
          description: 'If it has a {k}, score it and repeat this dogma effect. Otherwise, keep it.',
          func(context, player, data) {
            const { game } = context
            const card = game.getCardData(context.sentBack.card)
            if (card.biscuits.includes('k')) {
              context.sendBack({ repeatEffect: true })
              return game.aScore(context, player, card)
            }
          }
        }
      ]
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
