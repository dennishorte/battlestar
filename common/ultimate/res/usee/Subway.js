module.exports = {
  name: `Subway`,
  color: `yellow`,
  age: 7,
  expansion: `usee`,
  biscuits: `liih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Draw and tuck a {7}. If you have at least seven visible cards on your board of the color of the tucked card, draw a {9}. Otherwise, junk all cards on your board of that color, and draw an {8}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.aDrawAndTuck(player, game.getEffectAge(self, 7))

      const visibleCards = game.getVisibleCardsByZone(player, card.color)

      if (visibleCards >= 7) {
        game.aDraw(player, { age: game.getEffectAge(self, 9) })
      }
      else {
        game.aJunkMany(player, game.getCardsByZone(player, card.color), { ordered: true })
        game.aDraw(player, { age: game.getEffectAge(self, 8) })
      }
    },
  ],
}
