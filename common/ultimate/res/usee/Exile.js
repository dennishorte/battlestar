const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Exile`  // Card names are unique in Innovation
  this.name = `Exile`
  this.color = `yellow`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `lhlk`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you return a top card without [c] from your board! Return all cards of the returned card's value from your score pile!`,
    `If exactly one card was returned due to the demand, return Exile if it is a top card on any board and draw a [3].`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => !card.checkHasBiscuit('c'))
      
      const returned = game.aChooseAndReturn(player, choices, { min: 1, max: 1 })

      if (returned.length > 0) {
        const returnedCard = returned[0]
        const scoreCards = game
          .getCardsByZone(player, 'score')
          .filter(card => card.age === returnedCard.age)
        
        game.aReturnMany(player, scoreCards)
      }
    },
    (game, player, { leader }) => {
      const topCards = game
        .getPlayerAll()
        .flatMap(player => game.getTopCards(player))

      if (game.getZoneByPlayer(leader).dogmaEvents[0].cards.length === 1) {
        const exileCards = topCards.filter(card => card.name === 'Exile')
        if (exileCards.length > 0) {
          game.aChooseAndReturn(leader, exileCards, { min: 0, max: 1 })
          game.aDraw(leader, { age: game.getEffectAge(this, 3) })
        }
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