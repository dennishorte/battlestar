const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Philosophy`  // Card names are unique in Innovation
  this.name = `Philosophy`
  this.color = `purple`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `hsss`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay left any one color of your cards.`,
    `You may score a card from your hand.`
  ]

  this.dogmaImpl = [
    {
      dogma: `You may splay left any one color of your cards.`,
      steps: [
        {
          description: 'Choose up to one color to splay left',
          func(context, player) {
            const { game } = context
            return game.aChooseAndSplay(context, {
              playerName: player.name,
              direction: 'left',
            })
          }
        },
      ]
    },
    {
      dogma: `You may score a card from your hand.`,
      steps: [
        {
          description: 'Choose up to one card from your hand to score.',
          func(context, player) {
            const { game } = context
            return game.aChoose(context, {
              playerName: player.name,
              kind: 'Cards',
              choices: game.getHand(player).cards,
              min: 0,
              max: 1
            })
          }
        },
        {
          description: 'Score the chosen card, if any.',
          func(context, player) {
            const { game } = context
            const card = context.sentBack.chosen[0]
            if (card) {
              return game.aScore(context, player, card)
            }
            else {
              game.mLog({
                template: '{player} scores nothing',
                args: { player }
              })
              return context.done()
            }
          }
        },
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
