module.exports = {
  name: `Mysticism`,
  color: `purple`,
  age: 1,
  expansion: `base`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw and reveal a {1}. If it is the same color as any card on your board, meld it and draw a {1}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 1))
      const boardColors = game
        .getTopCards(player)
        .map(card => card.color)

      if (boardColors.includes(card.color)) {
        game.actions.meld(player, card)
        game.aDraw(player, { age: game.getEffectAge(self, 1) })
      }
    }
  ],
}
