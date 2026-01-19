export default {
  name: `Hunting`,
  color: `green`,
  age: 0,
  expansion: `base`,
  biscuits: `rrhk`,
  dogmaBiscuit: `r`,
  dogma: [
    `I demand you draw and reveal two {z}! Transfer the card of my choice to my board!`,
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const drawnCards = [
        game.actions.drawAndReveal(player, game.getEffectAge(self, 0)),
        game.actions.drawAndReveal(player, game.getEffectAge(self, 0)),
      ]

      game.actions.chooseAndTransfer(leader, drawnCards, { toBoard: true, player: leader })
    }
  ],
}
