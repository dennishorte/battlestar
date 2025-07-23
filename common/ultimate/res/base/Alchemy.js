module.exports = {
  name: `Alchemy`,
  color: `blue`,
  age: 3,
  expansion: `base`,
  biscuits: `hlkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw and reveal a {4} for every three {k} on your board. If any of the drawn cards are red, return the cards drawn and all card in your hand. Otherwise, keep them.`,
    `Meld a card from your hand, then score a card from your hand.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const biscuits = game.getBiscuits()
      const count = Math.floor(biscuits[player.name].k / 3)
      let red = false

      for (let i = 0; i < count; i++) {
        const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 4))
        red = red || card.color === 'red'
      }

      if (red) {
        game.log.add({
          template: '{player} drew a red card. Returning all cards in hand.',
          args: { player }
        })
        game.actions.returnMany(player, game.zones.byPlayer(player, 'hand').cards())
      }
    },
    (game, player) => {
      const hand = () => game
        .zones.byPlayer(player, 'hand')
        .cards()
        .map(c => c.id)
      game.actions.chooseAndMeld(player, hand())
      game.actions.chooseAndScore(player, hand())
    },
  ],
}
