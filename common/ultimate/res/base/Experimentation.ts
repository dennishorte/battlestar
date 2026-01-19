export default {
  name: `Experimentation`,
  color: `blue`,
  age: 4,
  expansion: `base`,
  biscuits: `hsss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld a {5}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => game.actions.drawAndMeld(player, game.getEffectAge(self, 5)),
  ],
}
