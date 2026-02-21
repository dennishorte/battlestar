module.exports = {
  id: "pan-baker-a122",
  name: "Pan Baker",
  deck: "occupationA",
  number: 122,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Grain Utilization\" action space, you also get 2 clay and 1 wood.",
  onAction(game, player, actionId) {
    if (actionId === 'sow-bake') {
      player.addResource('clay', 2)
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 2 clay and 1 wood from {card}',
        args: { player , card: this},
      })
    }
  },
}
