
const util = require('../../../lib/util.js')
const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Sudoku`,
  color: `purple`,
  age: 10,
  expansion: `echo`,
  biscuits: `shsb`,
  dogmaBiscuit: `s`,
  echo: ``,
  dogma: [
    `Draw and meld a card of any value. If you have at least nine different bonus values visible on your board, you win. Execute each of the melded card's non-demand dogma effects. Do not share them.`
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

      if (card) {
        game.aCardEffects(player, card, 'dogma')
      }
    }
  ],
  echoImpl: [],
}
