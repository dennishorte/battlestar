const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Soap`  // Card names are unique in Innovation
  this.name = `Soap`
  this.color = `yellow`
  this.age = 1
  this.expansion = `echo`
  this.biscuits = `l2hl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a color. You may tuck any number of cards of that color from your hand. If you tucked at least three, you may achieve (if eligible) a card from your hand.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const color = game.aChoose(player, game.utilColors())[0]
      const choices = game
        .getCardsByZone(player, 'hand')
        .filter(card => card.color === color)
      const tucked = game.aChooseAndTuck(player, choices, { min: 0, max: 999 })
      if (tucked.length >= 3) {
        const eligible = game
          .getCardsByZone(player, 'hand')
          .filter(card => game.checkAchievementEligibility(player, card))
        game.aChooseAndAchieve(player, eligible, { min: 0, max: 1 })
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
