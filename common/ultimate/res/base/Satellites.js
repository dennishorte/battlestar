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
      game.aReturnMany(player, game.getCardsByZone(player, 'hand'))
      game.aDraw(player, { age: game.getEffectAge(self, 8) })
      game.aDraw(player, { age: game.getEffectAge(self, 8) })
      game.aDraw(player, { age: game.getEffectAge(self, 8) })
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
    },
    (game, player) => {
      const cards = game.aChooseAndMeld(player, game.getCardsByZone(player, 'hand'))
      if (cards && cards.length > 0) {
        game.aSelfExecute(player, cards[0])
      }
    }
  ],
}
