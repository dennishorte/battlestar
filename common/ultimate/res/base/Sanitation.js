const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sanitation`  // Card names are unique in Innovation
  this.name = `Sanitation`
  this.color = `yellow`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you exchange the two highest cards in your hand with the lowest card in my hand!`,
    `Choose {7} or {8}. Junk all cards in that deck.`,
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const playerHand = game.getZoneByPlayer(player, 'hand')
      const leaderHand = game.getZoneByPlayer(leader, 'hand')
      const highest = game.aChooseHighest(player, playerHand.cards(), 2)
      const lowest = game.aChooseLowest(leader, leaderHand.cards(), 1)

      game.aExchangeCards(
        player,
        highest,
        lowest,
        playerHand,
        leaderHand,
      )
    },

    (game, player) => {
      const age = game.aChooseAge(player, [7, 8])
      game.aJunkDeck(player, age)
    },
  ]
  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
