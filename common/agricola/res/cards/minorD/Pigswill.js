module.exports = {
  id: "pigswill-d083",
  name: "Pigswill",
  deck: "minorD",
  number: 83,
  type: "minor",
  cost: { food: 2 },
  costAlternative: { grain: 1 },
  category: "Livestock Provider",
  text: "Each time you use the \"Fencing\" action space, you also get 1 wild boar.",
  onAction(game, player, actionId) {
    if (actionId === 'fencing' || actionId === 'build-fences') {
      player.addAnimals('boar', 1)
      game.log.add({
        template: '{player} gets 1 wild boar from {card}',
        args: { player , card: this},
      })
    }
  },
}
