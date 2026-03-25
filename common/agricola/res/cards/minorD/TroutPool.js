module.exports = {
  id: "trout-pool-d054",
  name: "Trout Pool",
  deck: "minorD",
  number: 54,
  type: "minor",
  cost: { clay: 2 },
  vps: 1,
  category: "Food Provider",
  text: "At the start of each work phase, if there are at least 3 food on the \"Fishing\" accumulation space, you get 1 food from the general supply.",
  matches_onWorkPhaseStart(game, _player) {
    return (game.state.actionSpaces['fishing']?.accumulated || 0) >= 3
  },
  onWorkPhaseStart(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food',
      args: { player },
    })
  },
}
