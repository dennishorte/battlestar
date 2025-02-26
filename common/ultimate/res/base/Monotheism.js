const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Monotheism`  // Card names are unique in Innovation
  this.name = `Monotheism`
  this.color = `purple`
  this.age = 2
  this.expansion = `base`
  this.biscuits = `hkkk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a top card on your board of a different color from any card on my board to my score pile! If you do, draw and tuck a {1}.`,
    `Draw and tuck a {1}.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const leaderColors = game
        .getTopCards(leader)
        .map(card => card.color)
      const choices = game
        .getTopCards(player)
        .filter(card => !leaderColors.includes(card.color))
      const transferred = game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(leader, 'score'))
      if (transferred.length > 0) {
        game.aDrawAndTuck(player, game.getEffectAge(this, 1))
      }
    },

    (game, player) => {
      game.aDrawAndTuck(player, game.getEffectAge(this, 1))
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
