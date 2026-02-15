module.exports = {
  id: "little-stick-knitter-b092",
  name: "Little Stick Knitter",
  deck: "occupationB",
  number: 92,
  type: "occupation",
  players: "1+",
  text: "From Round 5 on, each time you use the \"Sheep Market\" accumulation space, you can also take a \"Family Growth with Room Only\" action.",
  onAction(game, player, actionId) {
    if (actionId === 'take-sheep' && game.state.round >= 5 && player.canGrowFamily(true)) {
      game.actions.familyGrowth(player, true)
    }
  },
}
