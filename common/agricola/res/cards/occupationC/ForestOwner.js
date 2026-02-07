module.exports = {
  id: "forest-owner-c162",
  name: "Forest Owner",
  deck: "occupationC",
  number: 162,
  type: "occupation",
  players: "4+",
  text: "This card is an action space for all. If another player uses it, they get 3 wood and must give you 1 wood from the general supply. If you use it, you get 4 wood.",
  isActionSpace: true,
  actionSpaceForAll: true,
  actionSpaceEffect(game, player, owner) {
    if (player.name === owner.name) {
      player.addResource('wood', 4)
      game.log.add({
        template: '{player} gets 4 wood from Forest Owner',
        args: { player },
      })
    }
    else {
      player.addResource('wood', 3)
      owner.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 3 wood, {owner} gets 1 wood from Forest Owner',
        args: { player, owner },
      })
    }
  },
}
