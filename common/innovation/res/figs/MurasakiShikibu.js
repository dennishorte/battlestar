const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Murasaki Shikibu`  // Card names are unique in Innovation
  this.name = `Murasaki Shikibu`
  this.color = `purple`
  this.age = 3
  this.expansion = `figs`
  this.biscuits = `sh4*`
  this.dogmaBiscuit = `s`
  this.inspire = `Draw a {3}.`
  this.echo = ``
  this.karma = [
    `You may issue a Rivaly Decree with any two figures.`,
    `If you would claim a standard achievement, instead achieve a card of equal value from your score pile. Then claim the achievement, if you are still eligible.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDraw(player, { age: game.getEffectAge(this, 3) })
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry'
    },
    {
      trigger: 'achieve',
      kind: 'would-instead',
      matches: (game, player, { isStandard }) => isStandard,
      func: (game, player, { card }) => {
        const choices = game
          .getCardsByZone(player, 'score')
          .filter(other => other.age === card.age)
        const selected = game.aChooseCard(player, choices)
        if (selected) {
          game.aClaimAchievement(player, { card: selected })
        }

        if (game.checkAchievementEligibility(player, card)) {
          game.aClaimAchievement(player, { card })
        }
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
