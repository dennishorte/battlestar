module.exports = {
  id: "stone-tongs-a080",
  name: "Stone Tongs",
  deck: "minorA",
  number: 80,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "Each time you use a stone accumulation space, you get 1 additional stone.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-stone-1' || actionId === 'take-stone-2'
  },
  onAction(game, player, _actionId) {
    player.addResource('stone', 1)
    game.log.add({
      template: '{player} gets 1 additional stone',
      args: { player },
    })
  },
}
