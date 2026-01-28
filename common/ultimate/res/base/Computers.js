module.exports = {
  name: `Computers`,
  color: `blue`,
  age: 9,
  expansion: `base`,
  biscuits: `ihif`,
  dogmaBiscuit: `i`,
  dogma: [
    `You may splay your red or green cards up.`,
    `Draw and meld a {0}, then self-execute it.`,
  ],
  dogmaImpl: [
    (game, player) => game.actions.chooseAndSplay(player, ['red', 'green'], 'up'),
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
      if (card) {
        game.actions.selfExecute(player, card)
      }
    }
  ],
}
