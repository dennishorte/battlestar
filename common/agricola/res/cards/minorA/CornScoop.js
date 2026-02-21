module.exports = {
  id: "corn-scoop-a067",
  name: "Corn Scoop",
  deck: "minorA",
  number: 67,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "Each time you use the \"Grain Seeds\" action space, you get 1 additional grain.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain') {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 additional grain from {card}',
        args: { player , card: this},
      })
    }
  },
}
