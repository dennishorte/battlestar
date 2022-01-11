const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Domestication`  // Card names are unique in Innovation
  this.name = `Domestication`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `kchk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld the lowest card in your hand. Draw a {1}.`
  ]

  this.dogmaImpl = [
    {
      dogma: `Meld the lowest card in your hand. Draw a {1}.`,
      steps: [
        {
          description: 'Select the lowest card in your hand. You will meld it.',
          func(context, player) {
            const { game } = context
            const hand = game
              .getHand(player)
              .cards
              .map(game.getCardData)
              .sort((l, r) => l.age - r.age)

            const lowest = hand.length > 0 ? hand[0].age : undefined
            const lowestCards = hand
              .filter(d => d.age === lowest)
              .map(c => c.id)

            return game.aChoose(context, {
              playerName: player.name,
              kind: 'Cards',
              choices: lowestCards,
              reason: 'Domestication: Meld the lowest card in your hand.',
            })
          }
        },
        {
          description: 'Meld the card you chose.',
          func(context, player) {
            const { game } = context
            if (context.data.returned.length > 0) {
              game.aMeld(context, player, context.data.returned[0])
            }
            else {
              game.mLog({
                template: '{player} has no card to meld',
                args: { player },
              })
              return context.done()
            }
          },
        },
        {
          description: 'Draw a {1}.',
          func(context, player) {
            const { game } = context
            game.aDraw(context, player, 1)
          },
        },
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
