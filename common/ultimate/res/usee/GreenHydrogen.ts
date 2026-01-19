export default {
  name: `Green Hydrogen`,
  color: `green`,
  age: 11,
  expansion: `usee`,
  biscuits: `fffh`,
  dogmaBiscuit: `f`,
  dogma: [
    `Score all non-top green cards on your board. Draw and tuck an {e} for each card scored.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const greenCards = game
        .cards.byPlayer(player, 'green')
        .slice(1)

      const numScored = game.actions.scoreMany(player, greenCards).length

      for (let i = 0; i < numScored; i++) {
        game.actions.drawAndTuck(player, game.getEffectAge(self, 11))
      }
    },
  ],
}
