const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Crossbow`  // Card names are unique in Innovation
  this.name = `Crossbow`
  this.color = `red`
  this.age = 2
  this.expansion = `echo`
  this.biscuits = `3hkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card with a bonus from your hand to my score pile!`,
    `Transfer a card from your hand to any other player's board.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.checkHasBonus())
      game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'))
    },

    (game, player) => {
      const otherChoices = game
        .players.all()
        .filter(other => other !== player)
      const other = game.actions.choosePlayer(player, otherChoices)
      const card = game.actions.chooseCard(player, game.getCardsByZone(player, 'hand'))
      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(other, card.color))
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
