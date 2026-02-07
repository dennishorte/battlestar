module.exports = {
  id: "collier-b144",
  name: "Collier",
  deck: "occupationB",
  number: 144,
  type: "occupation",
  players: "3+",
  text: "Each time after you use the \"Clay Pit\" accumulation space, you get 1 reed and 1 wood. With 3 or more players, you get 1 additional wood on the \"Hollow\" accumulation space.",
  onAction(game, player, actionId) {
    if (actionId === 'take-clay') {
      player.addResource('reed', 1)
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 reed and 1 wood from Collier',
        args: { player },
      })
      if (game.players.count() >= 3) {
        game.addToAccumulationSpace('take-clay-2', 'wood', 1)
        game.log.add({
          template: '{player} places 1 wood on Hollow via Collier',
          args: { player },
        })
      }
    }
  },
}
