const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Johannes Vermeer`  // Card names are unique in Innovation
  this.name = `Johannes Vermeer`
  this.color = `purple`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `5h*c`
  this.dogmaBiscuit = `c`
  this.inspire = `Draw and score a {3}.`
  this.echo = ``
  this.karma = [
    `If you would claim a standard achievement, first claim an achievement of value one higher, regardless of eligibility.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aDrawAndScore(player, game.getEffectAge(this, 3))
  }
  this.karmaImpl = [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: (game, player, { isStandard }) => isStandard,
      func: (game, player, { age }) => {
        const choices = game
          .getAvailableAchievementsRaw(player)
          .filter(card => card.age === age + 1)
        const formatted = game.formatAchievements(choices)
        const selected = game.aChoose(player, formatted, { title: 'Choose Achievement' })
        if (selected && selected.length > 0) {
          game.aAchieveAction(player, selected[0], { nonAction: true })
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
