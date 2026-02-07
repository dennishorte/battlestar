module.exports = {
  id: "double-turn-plow-a020",
  name: "Double-Turn Plow",
  deck: "minorA",
  number: 20,
  type: "minor",
  cost: { grain: 1 },
  prereqs: { maxRound: 5 },
  category: "Farm Planner",
  text: "When you play this card, you can immediately plow up to 2 fields.",
  getSpecialCost(player, game) {
    if (game && game.state.round >= 4) {
      return { grain: 1, food: 1 }
    }
    return { grain: 1 }
  },
  onPlay(game, player) {
    game.actions.plowField(player, { immediate: true, optional: true })
    game.actions.plowField(player, { immediate: true, optional: true })
  },
}
