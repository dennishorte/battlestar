module.exports = {
  name: `Monotheism`,
  color: `purple`,
  age: 2,
  expansion: `base`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer a top card on your board of a different color from any card on my board to my score pile! If you do, draw and tuck a {1}.`,
    `Draw and tuck a {1}.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const leaderColors = game
        .getTopCards(leader)
        .map(card => card.color)
      const choices = game
        .getTopCards(player)
        .filter(card => !leaderColors.includes(card.color))
      const transferred = game.aChooseAndTransfer(player, choices, game.zones.byPlayer(leader, 'score'))
      if (transferred.length > 0) {
        game.actions.drawAndTuck(player, game.getEffectAge(self, 1))
      }
    },

    (game, player, { self }) => {
      game.actions.drawAndTuck(player, game.getEffectAge(self, 1))
    }
  ],
}
