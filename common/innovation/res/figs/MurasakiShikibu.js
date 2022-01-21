const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Murasaki Shikibu`  // Card names are unique in Innovation
  this.name = `Murasaki Shikibu`
  this.color = `purple`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `sh4*`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw a {3}.`
  this.echo = ``
  this.karma = [
    `You may issue a Rivaly Decree with any two figures.`,
    `If you would claim a standard achievement, instead achieve a card of equal value from your score pile. Then claim the achievement, if you are still eligible.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = [
    {
      dogma: `Draw a {3}`,
      steps: [
        {
          description: `Draw a {3}`,
          func(context, player) {
            const { game } = context
            return game.aDraw(context, player, 3)
          }
        }
      ]
    }
  ]
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
      checkApplies: () => true,
    },
    {
      karma: `If you would claim a standard achievement, instead achieve a card of equal value from your score pile. Then claim the achievement, if you are still eligible.`,
      trigger: 'claim-achievement',
      kind: 'would-instead',
      checkApplies(game, player, data) {
        return data.opts && data.opts.isAction
      },
      steps: [
        {
          description: 'Choose a card of equal value from your score pile to achieve.',
          func(context, player, { card }) {
            const { game } = context
            card = game.getCardData(card)
            const cards = game
              .getZoneScore(player)
              .cards
              .map(game.getCardData)
              .filter(c => c.age === card.age)
              .map(c => c.id)

            if (cards.length > 0) {
              return game.aChoose(context, {
                playerName: player.name,
                kind: 'Card',
                choices: cards,
                count: 1,
                reason: 'Murasaki Shikibu: Achieve a card of equal value from your score pile.',
              })
            }
          }
        },
        {
          description: 'Achieve the card you chose.',
          func(context, player) {
            const { game } = context
            if (context.sentBack.chosen) {
              const card = context.sentBack.chosen[0]
              if (card) {
                return game.aClaimAchievement(context, player, card)
              }
            }
          }
        },
        {
          description: 'Then claim the achievement, if you are still eligible.',
          func(context, player, { card }) {
            const { game } = context
            card = game.getCardData(card)
            if (game.checkCanClaimAchievement(player, card)) {
              return game.aClaimAchievement(context, player, card)
            }
          }
        },
      ]
    },
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
