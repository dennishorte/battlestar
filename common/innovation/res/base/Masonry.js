const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Masonry`  // Card names are unique in Innovation
  this.name = `Masonry`
  this.color = `yellow`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `khkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may meld any number of cards from your hand, each with a {k}.`,
    `If you melded four or more cards in this way, claim the Monument achievement.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      const cards = game.aChooseCards(player, choices, { min: 0, max: choices.length })
      const melded = game.aMeldMany(player, cards)

      if (melded.length >= 4 && !game.state.dogmaInfo.masonryMonumentPlayer) {
        game.state.dogmaInfo.masonryMonumentPlayer = player
      }
    },

    (game, player) => {
      if (game.state.dogmaInfo.masonryMonumentPlayer) {
        game.aClaimAchievement(game.state.dogmaInfo.masonryMonumentPlayer, { name: 'Monument' })
      }
      else {
        game.mLogNoEffect()
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
