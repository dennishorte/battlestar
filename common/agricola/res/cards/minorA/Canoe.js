module.exports = {
  id: "canoe-a078",
  name: "Canoe",
  deck: "minorA",
  number: 78,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  prereqs: { occupations: 1 },
  category: "Building Resource Provider",
  text: "Each time you use the \"Fishing\" accumulation space, you get an additional 1 food and 1 reed.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing') {
      player.addResource('food', 1)
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 food and 1 reed from Canoe',
        args: { player },
      })
    }
  },
}
