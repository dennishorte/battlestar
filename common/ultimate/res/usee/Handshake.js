const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Handshake`  // Card names are unique in Innovation
  this.name = `Handshake`
  this.color = `yellow`
  this.age = 1
  this.expansion = `uce`
  this.biscuits = `hckk`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all cards from my hand to your hand! Choose two colors of cards in your hand! Transfer all cards in your hand of those colors to my hand!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      // Transfer all cards from leader's hand to player's hand
      const leaderHand = game.getZoneByPlayer(leader, 'hand')
      const leaderCards = leaderHand.cards()
      game.aTransferMany(leader, leaderCards, game.getZoneByPlayer(player, 'hand'), { ordered: true })

      // Have player choose two colors
      const handColors = game
        .getCardsByZone(player, 'hand')
        .map(c => c.color)
      const uniqueColors = util.array.distinct(handColors).sort()
      const chosenColors = game.aChoose(player, uniqueColors, { count: 2 })

      // Transfer all cards of chosen colors from player's hand to leader's hand
      const playerHand = game.getZoneByPlayer(player, 'hand')
      const transferCards = playerHand.cards().filter(card => chosenColors.includes(card.color))
      game.aTransferMany(player, transferCards, leaderHand, { ordered: true })
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
