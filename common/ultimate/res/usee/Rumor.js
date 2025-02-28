const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Rumor`  // Card names are unique in Innovation
  this.name = `Rumor`
  this.color = `green`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return a card from your score pile. If you do, draw a card of value one higher than the card you return.`,
    `Transfer a card from your hand to the hand of the player on your left.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game.getCardsByZone(player, 'score')
      const returned = game.aChooseAndReturn(player, choices, { min: 0, max: 1 })
      
      if (returned && returned.length > 0) {
        const returnedAge = returned[0].age
        game.aDraw(player, { age: returnedAge + 1 })
      }
    },

    (game, player) => {
      const playerOnLeft = game.getPlayerByOffset(player, 1)
      const choices = game.getCardsByZone(player, 'hand')
      const card = game.aChooseCard(player, choices)

      if (card) {
        game.aTransfer(player, card, game.getZoneByPlayer(playerOnLeft, 'hand'))
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