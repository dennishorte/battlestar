const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Email`  // Card names are unique in Innovation
  this.name = `Email`
  this.color = `green`
  this.age = 9
  this.expansion = `echo`
  this.biscuits = `&iih`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = `Draw and foreshadow a {a}.`
  this.karma = []
  this.dogma = [
    `Draw and foreshadow a {9}.`,
    `Execute all non-demand dogma effects on your lowest non-green top card. Do not share them.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aDrawAndForeshadow(player, game.getEffectAge(this, 9))
    },
    (game, player) => {
      const sortedCards = game
        .getTopCards(player)
        .filter(card => card.color !== 'green')
        .sort((l, r) => l.age - r.age)
      const lowest = util.array.takeWhile(sortedCards, card => card.age === sortedCards[0].age)
      const card = game.aChooseCard(player, lowest)
      if (card) {
        game.aCardEffects(player, player, card, 'dogma', game.getBiscuits(player))
      }
      else {
        game.mLogNoEffect()
      }
    }
  ]
  this.echoImpl = (game, player) => {
    game.aDrawAndForeshadow(player, game.getEffectAge(this, 10))
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
