module.exports = {
  id: "moral-crusader-b106",
  name: "Moral Crusader",
  deck: "occupationB",
  number: 106,
  type: "occupation",
  players: "1+",
  text: "Immediately before the start of each round, if there are goods on remaining round spaces that are promised to you, you get 1 food.",
  onBeforeRoundStart(game, player) {
    if (game.hasScheduledGoodsForPlayer(player)) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Moral Crusader',
        args: { player },
      })
    }
  },
}
