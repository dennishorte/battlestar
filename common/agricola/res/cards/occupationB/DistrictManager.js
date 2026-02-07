module.exports = {
  id: "district-manager-b158",
  name: "District Manager",
  deck: "occupationB",
  number: 158,
  type: "occupation",
  players: "4+",
  text: "At the end of each work phase, if you used both the \"Forest\" and \"Grove\" accumulation spaces, you get 5 food.",
  onWorkPhaseEnd(game, player) {
    if (player.usedForestThisPhase && player.usedGroveThisPhase) {
      player.addResource('food', 5)
      game.log.add({
        template: '{player} gets 5 food from District Manager',
        args: { player },
      })
    }
  },
}
