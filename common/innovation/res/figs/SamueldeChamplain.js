const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Samuel de Champlain`  // Card names are unique in Innovation
  this.name = `Samuel de Champlain`
  this.color = `green`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `c5h*`
  this.dogmaBiscuit = `c`
  this.inspire = `Return a {5} from your hand. Draw a {6}.`
  this.echo = ``
  this.karma = [
    `If you would draw a fifth card into your hand, first claim an achievement of that card's value or below, regardless of eligibility.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    const fives = game
      .getCardsByZone(player, 'hand')
      .filter(card => card.age === game.getEffectAge(this, 5))
    game.aChooseAndReturn(player, fives)
    game.aDraw(player, { age: game.getEffectAge(this, 6) })
  }
  this.karmaImpl = [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player) => game.getCardsByZone(player, 'hand').length === 4,
      func: (game, player, { age }) => {
        const choices = game
          .getAvailableAchievementsRaw(player)
          .filter(ach => ach.age <= age)
        game.aChooseAndAchieve(player, choices, { nonAction: true })
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
