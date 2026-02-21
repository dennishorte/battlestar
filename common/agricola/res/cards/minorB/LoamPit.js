module.exports = {
  id: "loam-pit-b077",
  name: "Loam Pit",
  deck: "minorB",
  number: 77,
  type: "minor",
  cost: { food: 1 },
  vps: 1,
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "Each time you use the \"Day Laborer\" action space, you also get 3 clay.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      player.addResource('clay', 3)
      game.log.add({
        template: '{player} gets 3 clay from {card}',
        args: { player , card: this},
      })
    }
  },
}
