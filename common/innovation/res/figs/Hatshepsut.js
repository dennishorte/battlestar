const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hatshepsut`  // Card names are unique in Innovation
  this.name = `Hatshepsut`
  this.color = `green`
  this.age = 1
  this.expansion = `figs`
  this.biscuits = `1c*h`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw a {1}`
  this.echo = ``
  this.karma = [
    `If you would draw a card of value higher than 1 and you have a {1} in your hand, first return all cards from your hand and draw two cards of that value.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = [
    {
      dogma: `Draw a {1}`,
      steps: [
        {
          description: `Draw a {1}`,
          func(context, player) {
            const { game } = context
            return game.aDraw(context, player, 1)
          }
        }
      ]
    }
  ]
  this.karmaImpl = [
    {
      dogma: `If you would draw a card of value higher than 1 and you have a {1} in your hand, first return all cards from your hand and draw two cards of that value.`,
      trigger: 'draw',
      kind: 'would-first',
      checkApplies(game, player, { age }) {
        const hasOneInHand = game
          .getHand(player)
          .cards
          .map(game.getCardData)
          .filter(c => c.age === 1)
          .length > 0

        return age > 1 && hasOneInHand
      },
      steps: [
        {
          description: 'Return all cards from your hand.',
          func(context, player) {
            const { game } = context
            return game.aReturnMany(context, player, game.getHand(player).cards)
          },
        },
        {
          description: 'Draw two cards of that value.',
          func(context, player, { age }) {
            const { game } = context
            return game.aDrawMany(context, player, age, 2)
          },
        },
      ]
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
