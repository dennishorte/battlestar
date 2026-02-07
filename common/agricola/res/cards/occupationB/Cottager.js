module.exports = {
  id: "cottager-b087",
  name: "Cottager",
  deck: "occupationB",
  number: 87,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Day Laborer\" action space, you can also either build exactly 1 room or renovate your house. Either way, you have to pay the cost.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      game.actions.offerCottagerBuild(player, this)
    }
  },
}
