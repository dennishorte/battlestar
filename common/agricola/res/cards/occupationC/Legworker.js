module.exports = {
  id: "legworker-c117",
  name: "Legworker",
  deck: "occupationC",
  number: 117,
  type: "occupation",
  players: "1+",
  text: "Each time you use an action space that is orthogonally adjacent to another action space occupied by one of your people, you get 1 wood.",
  onAction(game, player, actionId) {
    // Check if player has another worker on an adjacent action space
    // Note: adjacency concept applies to physical board layout, which
    // is not tracked in the digital engine. This hook is a no-op.
    void(game, player, actionId)
  },
}
