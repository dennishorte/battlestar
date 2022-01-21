const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Construction`  // Card names are unique in Innovation
  this.name = `Construction`
  this.color = `red`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer two cards from your hand to my hand! Draw a {2}!`,
    `If you are the only player with five top cards, claim the Empire achievement.`
  ]

  this.dogmaImpl = [
    {
      dogma: `I demand you transfer two cards from your hand to my hand! Draw a {2}!`,
      demand: true,
      steps: [
        {
          description: 'I demand you select two cards in your hand.',
          func(context, player) {
            const { game } = context
            const hand = game
              .getHand(player)
              .cards

            return game.aChoose(context, {
              playerName: player.name,
              choices: hand,
              kind: 'Cards',
              count: 2,
              reason: 'Construction: I demand you transfer two cards from your hand to my hand!',
            })
          }
        },
        {
          description: 'I demand you transfer the cards you selected to my hand.',
          func(context, player) {
            const { game } = context
            const { effect } = context.data
            const cards = context.sentBack.chosen
            return game.aTransferCards(context, player, cards, game.getHand(effect.leader))
          },
        },
        {
          description: 'I demand you draw a {2}.',
          func(context, player) {
            const { game } = context
            return game.aDraw(context, player, 2)
          }
        },
      ],
    },

    {
      dogma: `If you are the only player with five top cards, claim the Empire achievement.`,
      steps: [
        {
          description: `If you are the only player with five top cards, claim the Empire achievement.`,
          func(context, player) {
            const { game } = context
            const topCards = Object.assign({}, ...game
              .getPlayerAll()
              .map(p => {
                const numTopCards = game
                  .utilColors()
                  .map(c => game.getCardTop(p, c))
                  .filter(card => card !== undefined)
                  .length
                return { [p.name]: numTopCards }
              }))

            const achievementIsAvailable = game.checkAchievementAvailable('Empire')
            const playerHasFive = topCards[player.name] === 5
            const otherPlayersHaveFive = Object
              .entries(topCards)
              .filter(([name, count]) => name !== player.name)
              .filter(([name, count]) => count === 5)
              .length > 0

            if (achievementIsAvailable && playerHasFive && !otherPlayersHaveFive) {
              return game.aClaimAchievement(context, player, 'Empire')
            }
            else {
              game.mLog({
                template: '{player}: no effect',
                args: { player }
              })
            }
          }
        }
      ],
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
