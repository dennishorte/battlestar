const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Bartholomew Roberts`  // Card names are unique in Innovation
  this.name = `Bartholomew Roberts`
  this.color = `green`
  this.age = 5
  this.expansion = `figs`
  this.biscuits = `*hc6`
  this.dogmaBiscuit = `c`
  this.inspire = `Score a top card with a {c} from anywhere.`
  this.echo = ``
  this.karma = [
    `If you would score a card, first claim an achievement matching that card's value, ignoring the age requirement.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    const choices = game
      .getPlayerAll()
      .flatMap(p => game.getTopCards(p))
      .filter(card => card.biscuits.includes('k'))
    game.aChooseAndScore(player, choices)
  }
  this.karmaImpl = [
    {
      trigger: 'score',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        const eligible = game
          .getEligibleAchievementsRaw(player)
          .filter(other => card.age === other.age)

        game.aChooseAndAchieve(player, eligible, { nonAction: true })
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
