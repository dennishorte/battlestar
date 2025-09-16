module.exports = {
  name: `Moses`,
  color: `yellow`,
  age: 4,
  expansion: `arti`,
  biscuits: `llhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to transfer all top cards with a {c} from your board to my score pile!`,
    `Score a top card with a {c}.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const cards = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('c'))
      game.aTransferMany(player, cards, game.getZoneByPlayer(leader, 'score'))
    },

    (game, player) => {
      const choices = game
        .getPlayerAll()
        .flatMap(player => game.getTopCards(player))
        .filter(card => card.checkHasBiscuit('c'))
      game.actions.chooseAndScore(player, choices)
    }
  ],
}
