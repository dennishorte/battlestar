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
      game.aChooseAndMeld(player, game.cards.byPlayer(player, 'hand'), { lowest: true })
      game.aDraw(player, { age: game.getEffectAge(self, 1) })
    }
  ],
}
