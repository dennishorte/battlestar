module.exports = {
  name: `Deepfake`,
  color: `purple`,
  age: 11,
  expansion: `echo`,
  biscuits: `hspp`,
  dogmaBiscuit: `p`,
  dogma: [
    `If it is your turn, transfer a top card from any board to your board, then super-execute a top card on your board other than Deepfake. If the transferred card is still a top card, transfer it to its original board.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      // If it is your turn...
      if (game.players.current().id !== player.id) {
        game.log.add({
          template: "It is not {player}'s turn",
          args: { player }
        })
        return
      }

      // Transfer a top card from any board to your board...
      const transferOptions = game
        .players
        .all()
        .flatMap(player => game.cards.tops(player))
        .filter(card => card.name !== 'Deepfake')

      const cardToTransfer = game.actions.chooseCard(player, transferOptions, {
        title: 'Choose a card to transfer',
      })
      const originalOwner = cardToTransfer.owner
      game.actions.transfer(player, cardToTransfer, game.zones.byPlayer(player, cardToTransfer.color))

      // Then super-execute a top card on your board other than Deepfake.
      const executeOptions = game
        .cards
        .tops(player)
        .filter(card => card.name !== 'Deepfake')

      const cardToExecute = game.actions.chooseCard(player, executeOptions)
      game.aSuperExecute(self, player, cardToExecute)

      // If the transferred card is still a top card...
      const topCardOfTransferredColor = game.cards.top(player, cardToTransfer.color)
      if (topCardOfTransferredColor && topCardOfTransferredColor.name === cardToTransfer.name) {

        // Transfer it to its original board.
        game.actions.transfer(player, cardToTransfer, game.zones.byPlayer(originalOwner, cardToTransfer.color))
      }
    }
  ]
}
