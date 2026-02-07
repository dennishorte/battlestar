module.exports = {
  id: "mining-hammer-b016",
  name: "Mining Hammer",
  deck: "minorB",
  number: 16,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "When you play this card, you immediately get 1 food. Each time you renovate, you can also build a stable without paying wood.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Mining Hammer',
      args: { player },
    })
  },
  onRenovate(game, player) {
    game.actions.buildFreeStable(player, this)
  },
}
