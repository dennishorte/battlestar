module.exports = {
  id: "reclamation-plow-a017",
  name: "Reclamation Plow",
  deck: "minorA",
  number: 17,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "After the next time you take animals from an accumulation space and accommodate all of them on your farm, you can plow 1 field.",
  onPlay(game, player) {
    player.reclamationPlowActive = true
  },
  onTakeAnimals(game, player, resource, count, allAccommodated) {
    if (player.reclamationPlowActive && allAccommodated) {
      player.reclamationPlowActive = false
      game.actions.plowField(player, { immediate: true })
    }
  },
}
