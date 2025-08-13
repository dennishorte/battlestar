const util = require('../../../lib/util.js')

module.exports = {
  name: `Piano`,
  color: `purple`,
  age: 5,
  expansion: `echo`,
  biscuits: `5&ms`,
  dogmaBiscuit: `s`,
  echo: `Draw a card of a value present in any player's hand.`,
  dogma: [
    `If you have five top cards, each with a different value, return five cards from your score pile and then draw and score a card of each of your top cards' values in ascending order.`
  ],
  dogmaImpl: [
    (game, player) => {
      const topCards = game.cards.tops(player)

      if (topCards.length === 5) {
        const values = util.array.distinct(topCards.map(card => card.getAge())).sort()

        if (values.length === 5) {
          game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'score'), { count: 5 })
          for (const age of values) {
            game.actions.drawAndScore(player, age)
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
  ],
  echoImpl: (game, player) => {
    const ages = game
      .players.all()
      .flatMap(player => game.cards.byPlayer(player, 'hand'))
      .map(card => card.getAge())
      .sort()
    const choices = util.array.distinct(ages)
    const age = game.actions.chooseAge(player, choices, { title: 'Choose an age to draw from' })
    if (age) {
      game.actions.draw(player, { age })
    }
  },
}
