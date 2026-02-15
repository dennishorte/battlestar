module.exports = {
  id: "swagman-a129",
  name: "Swagman",
  deck: "occupationA",
  number: 129,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you use the \"Farm Expansion\" or \"Grain Seeds\" action space, you can use the respective other space with the same person (even if it is occupied).",
  onAction(game, player, actionId) {
    if (actionId === 'build-room-stable') {
      game.actions.offerUseOtherSpace(player, this, 'take-grain', { allowOccupied: true })
    }
    else if (actionId === 'take-grain') {
      game.actions.offerUseOtherSpace(player, this, 'build-room-stable', { allowOccupied: true })
    }
  },
}
