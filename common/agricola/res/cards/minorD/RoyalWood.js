module.exports = {
  id: "royal-wood-d074",
  name: "Royal Wood",
  deck: "minorD",
  number: 74,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "At the end of each turn in which you use the \"Farm Expansion\" action space or build an improvement, you get 1 wood back for every 2 wood paid during those actions (rounded down).",
  matches_onFarmExpansion(_game, _player, woodPaid) {
    return woodPaid > 0 ? 'silent' : false
  },
  onFarmExpansion(_game, player, woodPaid) {
    player._royalWoodWoodPaid = (player._royalWoodWoodPaid || 0) + woodPaid
  },
  matches_onBuildImprovement(_game, _player, cost) {
    return (cost?.wood || 0) > 0 ? 'silent' : false
  },
  onBuildImprovement(_game, player, cost) {
    player._royalWoodWoodPaid = (player._royalWoodWoodPaid || 0) + (cost.wood || 0)
  },
  matches_onBeforeAction() {
    return 'silent'
  },
  onBeforeAction(_game, player) {
    delete player._royalWoodWoodPaid
  },
  matches_onPersonActionEnd(_game, player) {
    const woodPaid = player._royalWoodWoodPaid || 0
    if (woodPaid < 2) {
      return woodPaid > 0 ? 'silent' : false
    }
    return true
  },
  onPersonActionEnd(game, player) {
    const woodBack = Math.floor((player._royalWoodWoodPaid || 0) / 2)
    delete player._royalWoodWoodPaid
    if (woodBack > 0) {
      player.addResource('wood', woodBack)
      game.log.add({
        template: '{player} gets {amount} wood back',
        args: { player, amount: woodBack },
      })
    }
  },
}
