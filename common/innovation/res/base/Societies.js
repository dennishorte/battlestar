const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Societies`  // Card names are unique in Innovation
  this.name = `Societies`
  this.color = `purple`
  this.age = 5
  this.expansion = `base`
  this.biscuits = `chsc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card with a {s} higher than my top card of the same color from your board to my board! If you do, draw a {5}!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const choices = game
        .getTopCards(player)
        .filter(card => {
          const leaderCard = game.getTopCard(leader, card.color)
          if (!leaderCard) {
            return true
          }
          else {
            return leaderCard.age < card.age
          }
        })
      const card = game.aChooseAndTransfer(player, choices, { toBoard: true, player: leader })
      if (card) {
        game.aDraw(player, { age: game.getEffectAge(this, 5) })
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
