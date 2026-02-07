module.exports = {
  id: "cultivator-d104",
  name: "Cultivator",
  deck: "occupationD",
  number: 104,
  type: "occupation",
  players: "1+",
  text: "For each new field tile you get, you also get 1 wood and 1 food.",
  onPlow(game, player) {
    player.addResource('wood', 1)
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 wood and 1 food from Cultivator',
      args: { player },
    })
  },
}
