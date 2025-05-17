const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `Piano`  // Card names are unique in Innovation
  this.name = `Piano`
  this.color = `purple`
  this.age = 5
  this.expansion = `echo`
  this.biscuits = `5&ms`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = `Draw a card of a value present in any player's hand.`
  this.karma = []
  this.dogma = [
    `If you have five top cards, each with a different value, return five cards from your score pile and then draw and score a card of each of your top cards' values in ascending order.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const topCards = game.getTopCards(player)

      if (topCards.length === 5) {
        const values = util.array.distinct(topCards.map(card => card.getAge())).sort()

        if (values.length === 5) {
          game.aChooseAndReturn(player, game.getCardsByZone(player, 'score'), { count: 5 })
          for (const age of values) {
            game.aDrawAndScore(player, age)
          }
        }

        else {
          game.log.add({
            template: '{player} top cards do not have all different values',
            args: { player }
          })
        }
      }

      else {
        game.log.add({
          template: '{player} does not have five top cards',
          args: { player }
        })
      }
    }
  ]
  this.echoImpl = (game, player) => {
    const ages = game
      .players.all()
      .flatMap(player => game.getCardsByZone(player, 'hand'))
      .map(card => card.getAge())
      .sort()
    const choices = util.array.distinct(ages)
    const age = game.aChooseAge(player, choices, { title: 'Choose an age to draw from' })
    if (age) {
      game.aDraw(player, { age })
    }
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
