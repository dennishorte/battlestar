const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Agriculture`  // Card names are unique in Innovation
  this.name = `Agriculture`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may return a card from your hand. If you do, draw and score a card of value one higher than the card you returned.`
  ]

  this.dogmaImpl = [
    {
      dogma: `You may return a card from your hand. If you do, draw and score a card of value one higher than the card you returned.`,
      steps: [
        {
          description: 'You may choose a card to return from your hand.',
          func(context, player) {
            const { game } = context
            return game.aChoose(context, {
              playerName: player.name,
              choices: game.getHand(player).cards,
              kind: 'Cards',
              max: 1,
              min: 0,
            })
          }
        },
        {
          description: 'If you chose a card, return it.',
          func(context, player) {
            const { game } = context
            const { returned } = context.data

            if (returned.length === 0) {
              game.mLog({
                template: '{player} did not return a card',
                args: { player }
              })
              return context.done()
            }
            else {
              return game.aReturn(context, player, returned[0])
            }
          }
        },
        {
          description: 'If you returned a card, score a card of value one higher.',
          func(context, player) {
            const { game } = context
            const card = game.getCardData(context.data.returned)
            if (card) {
              return game.aDrawAndScore(context, player, card.age + 1)
            }
            else {
              return context.done()
            }
          }
        }
      ],
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
