const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Wristwatch`  // Card names are unique in Innovation
  this.name = `Wristwatch`
  this.color = `yellow`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `hfa&`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = `Take a non-yellow top card from your board and tuck it.`
  this.karma = []
  this.dogma = [
    `For each visible bonus on your board, draw and tuck a card of that value, in ascending order.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const bonuses = game.getBonuses(player).sort()
      for (const bonus of bonuses) {
        game.aDrawAndTuck(player, bonus)
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const choices = game
      .getTopCards(player)
      .filter(card => card.color !== 'yellow')
    game.aChooseAndTuck(player, choices)
  }
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
