const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Translation`  // Card names are unique in Innovation
  this.name = `Translation`
  this.color = `blue`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `hccc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may meld all the cards in your score pile. If you meld one, you must meld them all.`,
    `If each top card on your board has a {c}, claim the World achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const cards = game.getCardsByZone(player, 'score')
      if (cards.length === 0) {
        game.mLogNoEffect()
      }
      else {
        const doIt = game.aYesNo(player, 'Meld all cards in your score pile?')
        if (doIt) {
          game.aMeldMany(player, game.getCardsByZone(player, 'score'))
        }
        else {
          game.mLogDoNothing(player)
        }
      }
    },

    (game, player) => {
      const topCards = game.getTopCards(player)
      const topCoins = topCards.filter(card => card.checkHasBiscuit('c'))
      if (topCards.length === topCoins.length) {
        game.aClaimAchievement(player, { name: 'World' })
      }
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
