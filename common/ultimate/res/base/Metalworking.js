module.exports = {
  name: `Metalworking`,
  color: `red`,
  age: 1,
  expansion: `base`,
  biscuits: `kkhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw and reveal a {1}. If it has a {k}, score it and repeat this dogma effect. Otherwise, keep it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 1))
        if (card.checkHasBiscuit('k')) {
          game.actions.score(player, card)
        }
        else {
          break
        }
      }
    }
  ],
}
