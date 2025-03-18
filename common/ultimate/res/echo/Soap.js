const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Soap`  // Card names are unique in Innovation
  this.name = `Soap`
  this.color = `yellow`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `l2hl`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color. You may tuck any number of cards of that color from your hand. If you do, and your top card of that color is higher than each opponent's, you may achieve (if eligible) a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const color = game.aChoose(player, game.utilColors())[0]
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === color)

      const tucked = game.aChooseAndTuck(player, choices, { min: 0, max: 999 })

      if (tucked.length > 0) {
        const topValue = game.getTopCard(player, color).getAge()
        const opponentValues = game
          .getPlayerOpponents(player)
          .map(opp => game.getTopCard(opp, color))
          .filter(card => card)
          .map(card => card.getAge())

        if (opponentValues.every(value => value < topValue)) {
          const eligible = game
            .getCardsByZone(player, 'hand')
            .filter(card => game.checkAchievementEligibility(player, card))
          game.aChooseAndAchieve(player, eligible, { min: 0, max: 1 })
        }
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
