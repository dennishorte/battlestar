const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Machinery`  // Card names are unique in Innovation
  this.name = `Machinery`
  this.color = `yellow`
  this.age = 3
  this.expansion = `base`
  this.biscuits = `llhk`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you exchange all the cards in your hand with all the highest cards in my hand!`,
    `Score a card from your hand with a {k}.`,
    `You may splay your red cards left.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const playerHand = game.getZoneByPlayer(player, 'hand')
      const leaderHand = game.getZoneByPlayer(leader, 'hand')

      const yours = playerHand.cards()
      const mine = game.utilHighestCards(leaderHand.cards())

      game.aExchangeCards(
        player,
        yours,
        mine,
        playerHand,
        leaderHand
      )

      game.log.add({
        template: '{player} steals {count} cards from {player2}',
        args: {
          player: leader,
          count: yours.length,
          player2: player,
        }
      })
      game.log.add({
        template: '{player} give back {count} cards to {player2}',
        args: {
          player: leader,
          count: mine.length,
          player2: player,
        }
      })
    },

    (game, player) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBiscuit('k'))
      game.aChooseAndScore(player, choices)
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'left')
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
