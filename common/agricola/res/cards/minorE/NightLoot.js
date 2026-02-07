module.exports = {
  id: "night-loot-e005",
  name: "Night Loot",
  deck: "minorE",
  number: 5,
  type: "minor",
  cost: { food: 2 },
  text: "Immediately remove exactly 2 different building resources from accumulation spaces and place them in your supply.",
  onPlay(game, player) {
    game.actions.nightLoot(player, this)
  },
}
