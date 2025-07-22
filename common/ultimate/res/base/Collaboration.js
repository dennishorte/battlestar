const { GameOverEvent } = require('../../../lib/game.js')


module.exports = {
  name: `Collaboration`,
  color: `green`,
  age: 9,
  expansion: `base`,
  biscuits: `hcic`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you draw two {9} and reveal them! Transfer the card of my choice to my board, and meld the other!`,
    `If you have ten or more green cards on your board, you win.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const card1 = game.actions.drawAndReveal(player, game.getEffectAge(self, 9) )
      const card2 = game.actions.drawAndReveal(player, game.getEffectAge(self, 9) )

      const chosen = game.actions.chooseCard(leader, [card1, card2])
      const other = chosen === card1 ? card2 : card1

      game.aTransfer(player, chosen, game.zones.byPlayer(leader, chosen.color))
      game.actions.meld(player, other)
    },

    (game, player) => {
      const greenCount = game
        .zones.byPlayer(player, 'green')
        .cards()
        .length

      if (greenCount >= 10) {
        throw new GameOverEvent({
          player,
          reason: 'Collaboration'
        })
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
}
