module.exports = {
  name: `Stem Cells`,
  color: `yellow`,
  age: 10,
  expansion: `base`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may score all cards from your hand.`,
    `Draw an {e}.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.zones.byPlayer(player, 'hand')
      if (hand.cardlist().length === 0) {
        game.log.addNoEffect()
        return
      }

      const scoreAll = game.actions.chooseYesNo(player, 'Score all cards from your hand?')

      if (scoreAll) {
        game.actions.scoreMany(player, hand.cardlist())
      }
      else {
        game.log.addDoNothing(player)
      }
    },

    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 11) })
    },
  ],
}
