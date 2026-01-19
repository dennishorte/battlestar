export default {
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
    (game, player, { self }) => {
      const otherPlayers = game.players.all().filter(other => other.name !== player.name)
      const otherPlayer = game.actions.choosePlayer(player, otherPlayers)

      if (otherPlayer) {
        const cardInHand = game.actions.chooseCard(otherPlayer, game.zones.byPlayer(otherPlayer, 'hand').cardlist())

        if (cardInHand) {
          game.actions.transfer(otherPlayer, cardInHand, game.zones.byPlayer(player, cardInHand.color))
          game.log.add({
            template: 'Having the other player make the decisions is not implemented yet.'
          })
          game.aSelfExecute(self, player, cardInHand)
        }
      }
    },
  ],
}
