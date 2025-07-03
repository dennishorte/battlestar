module.exports = {
  name: `Engineering`,
  color: `red`,
  age: 3,
  expansion: `base`,
  biscuits: `khsk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I demand you transfer all top cards with a {k} from your board to my score pile!`,
    `You may splay your red cards left.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const targets = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('k'))
      game.aTransferMany(player, targets, game.getZoneByPlayer(leader, 'score'))
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['red'], 'left')
    }
  ],
}
