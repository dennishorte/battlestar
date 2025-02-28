const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Assassination`  // Card names are unique in Innovation
  this.name = `Assassination`
  this.color = `red`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `chck`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you draw and reveal a {1}. If it has {k}, transfer it and the top card on your board of its color to my score pile!`,
    `If no player has a top green card, claim the Confidence achievement.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 1))

      if (card.checkHasBiscuit('k')) {
        game.aTransfer(player, card, game.getZoneByPlayer(leader, 'score'))
        const topCard = game.getTopCard(player, card.color)
        if (topCard) {
          game.aTransfer(player, topCard, game.getZoneByPlayer(leader, 'score'))
        }
      }
    },

    (game, player) => {
      const topGreenCards = game
        .getPlayerAll()
        .map(p => game.getTopCard(p, 'green'))
        .filter(card => Boolean(card))

      if (topGreenCards.length === 0) {
        game.aClaimAchievement(player, { name: 'Confidence' })
      }
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
