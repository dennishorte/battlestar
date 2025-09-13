const { GameOverEvent } = require('../../../lib/game.js')


module.exports = {
  name: `Self Service`,
  color: `green`,
  age: 10,
  expansion: `base`,
  biscuits: `hcpc`,
  dogmaBiscuit: `c`,
  dogma: [
    `If you have at least twice as many achievements as any other opponent, you win.`,
    `Self-execute any top card other than Self Service on your board.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const mine = game.getAchievementsByPlayer(player).total
      const others = game
        .players.opponentsOf(player)
        .map(player => game.getAchievementsByPlayer(player).total * 2)

      if (mine > 0 && others.every(count => count <= mine)) {
        throw new GameOverEvent({
          player,
          reason: self.name
        })
      }
      else {
        game.log.addNoEffect()
      }
    },

    (game, player, { self }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card !== self)
      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.aSelfExecute(player, card)
      }
    },

  ],
}
