module.exports = {
  name: `Electricity`,
  color: `green`,
  age: 7,
  expansion: `base`,
  biscuits: `sfhf`,
  dogmaBiscuit: `f`,
  dogma: [
    `Return all your top cards without a {f}, and then draw an {8} for each card you returned.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const toReturn = game
        .getTopCards(player)
        .filter(card => !card.checkHasBiscuit('f'))
      const returned = game.actions.returnMany(player, toReturn)
      if (returned) {
        for (let i = 0; i < returned.length; i++) {
          game.actions.draw(player, { age: game.getEffectAge(self, 8) })
        }
      }
    }
  ],
}
