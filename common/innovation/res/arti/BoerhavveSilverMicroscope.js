const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Boerhavve Silver Microscope`  // Card names are unique in Innovation
  this.name = `Boerhavve Silver Microscope`
  this.color = `blue`
  this.age = 5
  this.expansion = `arti`
  this.biscuits = `sfsh`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Return the lowest card in your hand and the lowest top card on your board. Draw and score a card of value equal to the sum of the values of the cards returned.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const lowestHandCards = game.utilLowestCards(game.getCardsByZone(player, 'hand'))
      const lowestBoardCards = game.utilLowestCards(game.getTopCards(player))

      const cards1 = game.aChooseAndReturn(player, lowestHandCards) || []
      const cards2 = game.aChooseAndReturn(player, lowestBoardCards) || []

      const returnedSum = []
        .concat(cards1, cards2)
        .map(card => card.getAge())
        .reduce((agg, next) => agg + next, 0)

      game.aDrawAndScore(player, returnedSum)
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
