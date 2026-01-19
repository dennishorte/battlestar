export default {
  name: `Tracking`,
  color: `purple`,
  age: 0,
  expansion: `base`,
  biscuits: `chcr`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw to {z}. Return one of them.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const drawnCards = [
        game.actions.draw(player, { age: game.getEffectAge(self, 0) }),
        game.actions.draw(player, { age: game.getEffectAge(self, 0) }),
      ]

      game.actions.chooseAndReturn(player, drawnCards)
    }
  ],
}
