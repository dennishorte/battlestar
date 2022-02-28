const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Alexander the Great`  // Card names are unique in Innovation
  this.name = `Alexander the Great`
  this.color = `red`
  this.age = 2
  this.expansion = `figs`
  this.biscuits = `2*hk`
  this.dogmaBiscuit = `k`
  this.inspire = `Score a card from your hand.`
  this.echo = ``
  this.karma = [
    `When you meld this card, score all opponent's top figures of value 1 or 2.`,
    `If you would take a Dogma action, instead of using the featured icon use each player's current score.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    const choices = game
      .getZoneByPlayer(player, 'hand')
      .cards()
    game.aChooseAndScore(player, choices)
  }
  this.karmaImpl = [
    {
      trigger: 'when-meld',
      func(game, player) {
        const topFigures = game
          .getPlayerOpponents(player)
          .flatMap(opp => game.getTopCards(opp))
          .filter(card => card.expansion === 'figs')
          .filter(card => card.age === 1 || card.age === 2)

        game.aScoreMany(player, topFigures)
      }
    },
    {
      trigger: 'featured-biscuit',
      matches: () => true,
      func: () => 'score'
    },
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
