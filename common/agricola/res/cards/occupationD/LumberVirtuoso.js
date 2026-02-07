module.exports = {
  id: "lumber-virtuoso-d129",
  name: "Lumber Virtuoso",
  deck: "occupationD",
  number: 129,
  type: "occupation",
  players: "1+",
  text: "Each harvest in which you have at least 5 wood in your supply, you can discard down to 5 wood to take a \"Build Stables\" or \"Build Wood Rooms\" action by paying the usual costs.",
  onHarvest(game, player) {
    if (player.wood >= 5) {
      game.actions.offerLumberVirtuosoAction(player, this)
    }
  },
}
