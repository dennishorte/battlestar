module.exports = {
  id: "district-manager-b158",
  name: "District Manager",
  deck: "occupationB",
  number: 158,
  type: "occupation",
  players: "4+",
  text: "At the end of each work phase, if you used both the \"Forest\" and \"Grove\" accumulation spaces, you get 5 food.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood') {
      player._dmUsedForest = true
    }
    if (actionId === 'grove' || actionId === 'grove-5' || actionId === 'grove-6') {
      player._dmUsedGrove = true
    }
  },
  onWorkPhaseEnd(game, player) {
    if (player._dmUsedForest && player._dmUsedGrove) {
      player.addResource('food', 5)
      game.log.add({
        template: '{player} gets 5 food from District Manager',
        args: { player },
      })
    }
    delete player._dmUsedForest
    delete player._dmUsedGrove
  },
}
