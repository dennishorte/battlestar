module.exports = {
  id: "steam-plow-d018",
  name: "Steam Plow",
  deck: "minorD",
  number: 18,
  type: "minor",
  cost: { wood: 1, food: 1 },
  vps: 1,
  category: "Farm Planner",
  text: "Immediately after each returning home phase, you can pay 2 wood and 1 food to use the \"Farmland\" action space without placing a person.",
  onReturnHome(game, player) {
    if (player.wood >= 2 && player.food >= 1) {
      game.actions.offerSteamPlow(player, this)
    }
  },
}
