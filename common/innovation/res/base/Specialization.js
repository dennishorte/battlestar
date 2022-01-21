const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Specialization`  // Card names are unique in Innovation
  this.name = `Specialization`
  this.color = `purple`
  this.age = 9
  this.expansion = `base`
  this.biscuits = `hflf`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal a card from your hand. Take into your hand the top card of that color from all opponents' boards.`,
    `You may splay your yellow or blue cards up.`
  ]

  this.dogmaImpl = [
    {
      dogma: `Reveal a card from your hand. Take into your hand the top card of that color from all opponents' boards.`,
      steps: [
        {
          description: 'Choose a card to reveal',
          func(context, player) {
            const { game } = context
            return game.aChoose(context, {
              playerName: player.name,
              choices: game.getHand(player).cards,
              count: 1
            })
          }
        },
        {
          description: "Take into your hand the top card of the revealed card's color (if any) from all opponents' boards.",
          func(context, player) {
            const { game } = context
            const card = game.getCardData(context.sentBack.chosen[0])
            if (card) {
              const targets = game
                .getPlayerAll()
                .filter(p => p.name !== player.name)
                .map(p => game.getCardTop(p, card.color))
                .filter(card => card !== undefined)
                .map(card => card.id)
              return game.aTransferCards(context, player, targets, game.getHand(player))
            }
          }
        },
      ]
    },
    {
      dogma: `You may splay your yellow or blue cards up.`,
      steps: [
        {
          description: `You may splay your yellow or blue cards up.`,
          func(context, player) {
            const { game } = context
            return game.aChooseAndSplay(context, {
              playerName: player.name,
              direction: 'up',
              choices: ['blue', 'yellow']
            })
          }
        }
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
