module.exports = {
  name: `Domestication`,
  color: `yellow`,
  age: 1,
  expansion: `base`,
  biscuits: `kchk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Meld the lowest card in your hand. Draw a {1}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.aChooseLowest(player, game.cards.byPlayer(player, 'hand'), 1)[0]
      if (card) {
        game.actions.meld(player, card)
      }
      game.actions.draw(player, { age: game.getEffectAge(self, 1) })
    }
  ],
}
