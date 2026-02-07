module.exports = {
  id: "nightworker-c125",
  name: "Nightworker",
  deck: "occupationC",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "Before the start of each work phase, you can place a person on an accumulation space of a building resource not in your supply. (Then proceed with the start player.)",
  onBeforeWorkPhase(game, player) {
    const missingResources = []
    if (player.wood === 0) {
      missingResources.push('wood')
    }
    if (player.clay === 0) {
      missingResources.push('clay')
    }
    if (player.reed === 0) {
      missingResources.push('reed')
    }
    if (player.stone === 0) {
      missingResources.push('stone')
    }
    if (missingResources.length > 0) {
      game.actions.offerNightworkerPlacement(player, this, missingResources)
    }
  },
}
