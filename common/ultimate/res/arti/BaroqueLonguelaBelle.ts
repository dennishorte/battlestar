export default {
  name: `Baroque-Longue la Belle`,
  color: `green`,
  age: 5,
  expansion: `arti`,
  biscuits: `fhfc`,
  dogmaBiscuit: `f`,
  dogma: [
    `Draw and meld a {5}. If the drawn card is not green, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 5))
        if (card.color === 'green') {
          break
        }
      }
    }
  ],
}
