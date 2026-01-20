const util = require('../../../lib/util.js')

module.exports = {
  name: `Sudoku`,
  color: `purple`,
  age: 10,
  expansion: `echo`,
  biscuits: `sh&b`,
  dogmaBiscuit: `s`,
  echo: `You may tuck any number of cards from your hand.`,
  dogma: [
    `Draw and meld a card of any value. If you have at least nine different bonus values on your board, you win. Otherwise, self-execute the medled card.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const age = game.actions.chooseAge(player)
      const card = game.actions.drawAndMeld(player, age)

      const bonuses = util.array.distinct(game.getBonuses(player))
      if (bonuses.length >= 9) {
        game.youWin(player, self.name)
      }

      else if (card) {
        game.actions.selfExecute(self, player, card)
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      game.actions.chooseAndTuck(player, game.cards.byPlayer(player, 'hand'), { min: 0 })
    }
  ],
}
