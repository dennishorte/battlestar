module.exports = {
  name: `Hitchhiking`,
  color: `green`,
  age: 8,
  expansion: `usee`,
  biscuits: `fiih`,
  dogmaBiscuit: `i`,
  dogma: [
    `Choose another player. They transfer a card from their hand to your board. If they do, self-execute the card, with that player making all decisions and allowed to look at any card that you can.`
  ],
  dogmaImpl: [
    (game, player) => {
      const otherPlayers = game.players.all().filter(other => other.name !== player.name)
      const otherPlayer = game.actions.choosePlayer(player, otherPlayers)

      if (otherPlayer) {
        const cardInHand = game.actions.chooseCard(otherPlayer, game.getZoneByPlayer(otherPlayer, 'hand').cards())

        if (cardInHand) {
          game.aTransfer(otherPlayer, cardInHand, game.getZoneByPlayer(player, cardInHand.color))
          game.log.add({
            template: 'Having the other player make the decisions is not implemented yet.'
          })
          game.aSelfExecute(player, cardInHand)
        }
      }
    },
  ],
}
