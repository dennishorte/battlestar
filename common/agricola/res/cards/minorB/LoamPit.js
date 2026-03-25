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
  matches_onAction(game, player, actionId) {
    return actionId === 'day-laborer'
  },
  onAction(game, player, _actionId) {
    player.addResource('clay', 3)
    game.log.add({
      template: '{player} gets 3 clay',
      args: { player },
    })
  },
}
