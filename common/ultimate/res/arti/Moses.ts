export default {
  name: `Moses`,
  color: `yellow`,
  age: 4,
  expansion: `arti`,
  biscuits: `llhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to transfer a top card with a {c} of each color from your board to my score pile!`,
    `Score a top card with a {c}.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const cards = game
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit('c'))
      game.actions.transferMany(player, cards, game.zones.byPlayer(leader, 'score'))
    },

    (game, player) => {
      const choices = game
        .players.all()
        .flatMap(player => game.cards.tops(player))
        .filter(card => card.checkHasBiscuit('c'))
      game.actions.chooseAndScore(player, choices)
    }
  ],
}
