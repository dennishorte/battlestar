module.exports = {
  id: "harpooner-a138",
  name: "Harpooner",
  deck: "occupationA",
  number: 138,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Fishing\" accumulation space you can also pay 1 wood to get 1 food for each person you have, and 1 reed.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing' && player.wood >= 1) {
      game.actions.offerHarpoonerBonus(player, this)
    }
  },
}
