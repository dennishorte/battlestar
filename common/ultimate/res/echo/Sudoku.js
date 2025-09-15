const util = require('../../../lib/util.js')
const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Sudoku`,
  color: `purple`,
  age: 10,
  expansion: `echo`,
  biscuits: `shsb`,
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
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }

      else if (card) {
        game.aSelfExecute(player, card)
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      game.actions.chooseAndTuck(player, game.cards.byPlayer(player, 'hand'), { min: 0 })
    }
  ],
}
