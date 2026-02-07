module.exports = {
  id: "bellfounder-d107",
  name: "Bellfounder",
  deck: "occupationD",
  number: 107,
  type: "occupation",
  players: "1+",
  text: "In the returning home phase of each round, if you have at least 1 clay, you can use this card to discard all of your clay and get your choice of 3 food or 1 bonus point.",
  onReturnHome(game, player) {
    if (player.clay >= 1) {
      game.actions.offerBellfounderExchange(player, this)
    }
  },
}
