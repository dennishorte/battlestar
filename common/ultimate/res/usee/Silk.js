const util = require('../../../lib/util.js')

module.exports = {
  name: `Silk`,
  color: `green`,
  age: 1,
  expansion: `usee`,
  biscuits: `cclh`,
  dogmaBiscuit: `c`,
  dogma: [
    `Meld a card from your hand.`,
    `You may score a card from your hand of each color on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.cards.byPlayer(player, 'hand')
      game.actions.chooseAndMeld(player, cards)
    },
    (game, player) => {
      const boardColors = game
        .getTopCards(player)
        .map(card => card.color)

      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => boardColors.includes(card.color))

      while (true) {
        const choiceColors = util.array.distinct(choices.map(c => c.color))

        const toScore = game.actions.chooseCards(player, choices, {
          title: 'You may score a card from your hand of each color on your board.',
          min: 0,
          max: choiceColors.length,
        })

        if (util.array.isDistinct(toScore.map(c => c.color))) {
          game.aScoreMany(player, toScore)
          break
        }
        else {
          game.log.add({ template: 'Must choose only one card per color' })
          continue
        }
      }
    }
  ],
}
