module.exports = {
  name: `Specialization`,
  color: `purple`,
  age: 9,
  expansion: `base`,
  biscuits: `hflf`,
  dogmaBiscuit: `f`,
  dogma: [
    `Reveal a card from your hand. Take into your hand the top card of that color from all opponents' boards.`,
    `You may splay your yellow or blue cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const hand = game.zones.byPlayer(player, 'hand')
      const card = game.actions.chooseCard(player, hand.cards())

      if (card) {
        game.actions.reveal(player, card)

        const stolen = game
          .players.opponentsOf(player)
          .map(opponent => game.getTopCard(opponent, card.color))
          .filter(card => card !== undefined)

        game.aTransferMany(player, stolen, hand)
      }
    },
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'blue'], 'up')
    },
  ],
}
