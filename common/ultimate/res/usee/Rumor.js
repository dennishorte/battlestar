const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rumor`  // Card names are unique in Innovation
  this.name = `Rumor`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your score pile. If you do, draw a card of value one higher than the card you returned.`,
    `Transfer a card from your hand to the hand of the player on your left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game.getCardsByZone(player, 'score')
      const returned = game.aChooseAndReturn(player, choices, {
        title: 'Return a card from your score pile',
        count: 1,
      })[0]

      if (returned) {
        game.aDraw(player, { age: returned.age + 1 })
      }
    },

    (game, player) => {
      const choices = game.getCardsByZone(player, 'hand')
      const card = game.aChooseCard(player, choices)

      if (card) {
        const playerOnLeft = game.players.following(player)
        game.aTransfer(player, card, game.getZoneByPlayer(playerOnLeft, 'hand'))
      }
    }
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
