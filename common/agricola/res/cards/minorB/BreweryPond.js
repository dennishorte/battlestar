module.exports = {
  id: "brewery-pond-b040",
  name: "Brewery Pond",
  deck: "minorB",
  number: 40,
  type: "minor",
  cost: {},
  vps: -1,
  prereqs: { occupations: 2 },
  category: "Building Resource Provider",
  text: "Each time you use the \"Fishing\" or \"Reed Bank\" accumulation space, you also get 1 grain and 1 wood.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing' || actionId === 'take-reed') {
      player.addResource('grain', 1)
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 grain and 1 wood from Brewery Pond',
        args: { player },
      })
    }
  },
}
