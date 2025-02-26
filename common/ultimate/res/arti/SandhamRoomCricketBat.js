const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Sandham Room Cricket Bat`  // Card names are unique in Innovation
  this.name = `Sandham Room Cricket Bat`
  this.color = `purple`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `llfh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and reveal a {6}. If it is red, claim an achievement, ignoring eligibility.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const card = game.aDrawAndReveal(player, game.getEffectAge(this, 6))
      if (card.color === 'red') {
        game.mLog({ template: 'Card is red' })
        const choices = game.getAvailableAchievementsRaw(player)
        game.aChooseAndAchieve(player, choices)
      }
      else {
        game.mLog({ template: 'Card is not red' })
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
