const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Clothing`  // Card names are unique in Innovation
  this.name = `Clothing`
  this.color = `green`
  this.age = 1
  this.expansion = `base`
  this.biscuits = `hcll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Meld a card from your hand of a different color from any card on your board.`,
    `Draw and score a {1} for each color present on your board not present on any opponent's board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const usedColors = game
        .getTopCards(player)
        .map(card => card.color)

      const choices = game
        .getZoneByPlayer(player, 'hand')
        .cards()
        .filter(card => !usedColors.includes(card.color))

      game.aChooseAndMeld(player, choices)
    },

    (game, player) => {
      const opponentColors = game
        .getPlayerOpponents(player)
        .flatMap(opp => game.getTopCards(opp))
        .map(card => card.color)

      const playerOnlyColors = game
        .getTopCards(player)
        .map(card => card.color)
        .filter(color => !opponentColors.includes(color))
        .length

      if (playerOnlyColors === 0) {
        game.mLogNoEffect()
      }
      else {
        for (let i = 0; i < playerOnlyColors; i++) {
          game.aDrawAndScore(player, game.getEffectAge(this, 1))
        }
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
