module.exports = {
  name: `Satellites`,
  color: `green`,
  age: 9,
  expansion: `base`,
  biscuits: `hiii`,
  dogmaBiscuit: `i`,
  dogma: [
    `Return all cards from your hand, and draw three {8}.`,
    `You may splay your purple cards up.`,
    `Meld a card from your hand and then self-execute it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.returnMany(player, game.cards.byPlayer(player, 'hand'))
      game.actions.draw(player, { age: game.getEffectAge(self, 8) })
      game.actions.draw(player, { age: game.getEffectAge(self, 8) })
      game.actions.draw(player, { age: game.getEffectAge(self, 8) })
    },
    (game, player) => {
      game.actions.chooseAndSplay(player, ['purple'], 'up')
    },
    (game, player, { self }) => {
      const cards = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'))
      if (cards && cards.length > 0) {
        game.actions.selfExecute(self, player, cards[0])
      }
    }
  ],
}
