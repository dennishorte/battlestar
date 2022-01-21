const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `John Von Neumann`  // Card names are unique in Innovation
  this.name = `John Von Neumann`
  this.color = `red`
  this.age = 8
  this.expansion = `figs`
  this.biscuits = `hii&`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw and reveal two {9}. If either is purple, return them.`
  this.karma = [
    `When you meld this card, return all opponents' top figures.`,
    `Each card in your hand provides two additional {i}.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = [
    {
      dogma: `Draw and reveal two {9}. If either is purple, return them.`,
      steps: [
        {
          description: 'Draw and reveal two {9}.',
          func(context, player) {
            const { game } = context
            return game.aDrawMany(context, player, 9, 2, true)
          }
        },
        {
          description: 'If either of the drawn cards is purple, return them.',
          func(context, player) {
            const { game } = context
            const drawnCards = context.sentBack.cards.map(game.getCardData)
            const drewPurple = drawnCards.some(c => c.color === 'purple')

            if (drewPurple) {
              return game.aReturnMany(context, player, drawnCards)
            }
          }
        },
      ]
    }
  ]
  this.inspireImpl = []
  this.karmaImpl = [
    {
      dogma: `When you meld this card, return all opponents' top figures.`,
      trigger: 'meld-after',
      kind: 'when',
      steps: [
        {
          description: `When you meld this card, return all opponents' top figures.`,
          func(context, player) {
            const { game } = context
            const topFigures = game
              .getPlayerAll()
              .filter(p => p.name !== player.name)
              .flatMap(p => {
                const colors = game.utilColors()
                return colors.map(c => game.getCardTop(p, c))
              })
              .filter(c => c !== undefined)
              .filter(c => c.expansion === 'figs')

            return game.aReturnMany(context, player, topFigures)
          }
        },
      ]
    },
    {
      dogma: `Each card in your hand provides two additional {i}.`,
      checkApplies: () => true,
      trigger: 'calculate-biscuits',
      func(game, player, boardBiscuits) {
        const biscuits = game.utilEmptyBiscuits()
        biscuits.i = game.getHand(player).cards.length * 2
        return biscuits
      }
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
