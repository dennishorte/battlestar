const util = require('../../../lib/util.js')

module.exports = {
  name: `Popular Science`,
  color: `blue`,
  age: 5,
  expansion: `usee`,
  biscuits: `scsh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld a card of value equal to the value of a top green card anywhere.`,
    `Draw and meld a card of value one higher than the value of your top yellow card.`,
    `You may splay your blue cards right.`
  ],
  dogmaImpl: [
    (game, player) => {
      const topGreenCards = game
        .players.all()
        .map(player => game.getTopCard(player, 'green'))
        .filter(card => card !== undefined)

      if (topGreenCards.length === 0) {
        game.log.add({ template: 'No player has a top green card.' })
        return
      }

      const ages = util.array.distinct(topGreenCards.map(card => card.getAge()))
      const age = game.aChooseAge(player, ages, { title: 'Choose age of card to draw and meld' })
      game.aDrawAndMeld(player, age)
    },

    (game, player) => {
      const topYellowCard = game.getTopCard(player, 'yellow')
      if (!topYellowCard) {
        game.log.addNoEffect()
        return
      }

      const age = topYellowCard.getAge() + 1
      game.aDrawAndMeld(player, age)
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
    },
  ],
}
