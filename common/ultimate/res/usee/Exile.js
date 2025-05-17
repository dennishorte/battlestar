const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Exile`  // Card names are unique in Innovation
  this.name = `Exile`
  this.color = `yellow`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `lhlk`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a top card without {l} from your board! Return all cards of the returned card's value from your score pile!`,
    `If exactly one card was returned due to the demand, return Exile if it is a top card on any board and draw a {3}.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => !card.checkHasBiscuit('l'))

      const returned = game.aChooseAndReturn(player, choices, { count: 1 })[0]

      if (returned) {
        const scoreCards = game
          .getCardsByZone(player, 'score')
          .filter(card => card.age === returned.age)

        const scored = game.aReturnMany(player, scoreCards)

        if (scored.length === 0) {
          game.state.dogmaInfo.exileReturnedOneCard = true
        }
      }
    },
    (game, player) => {
      if (game.state.dogmaInfo.exileReturnedOneCard) {
        const topCards = game
          .players.all()
          .flatMap(player => game.getTopCards(player))

        const exileCards = topCards.filter(card => card.name === 'Exile')
        if (exileCards.length > 0) {
          game.aReturn(player, exileCards[0])
          game.aDraw(player, { age: game.getEffectAge(this, 3) })
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
