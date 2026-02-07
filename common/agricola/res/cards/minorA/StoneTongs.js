module.exports = {
  id: "stone-tongs-a080",
  name: "Stone Tongs",
  deck: "minorA",
  number: 80,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "Each time you use a stone accumulation space, you get 1 additional stone.",
  onAction(game, player, actionId) {
    if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 additional stone from Stone Tongs',
        args: { player },
      })
    }
  },
}
