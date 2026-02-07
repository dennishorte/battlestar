module.exports = {
  id: "wood-barterer-d119",
  name: "Wood Barterer",
  deck: "occupationD",
  number: 119,
  type: "occupation",
  players: "1+",
  text: "Each time before you use an action space with a \"Build Fences\" or \"Build Rooms\" action, you can choose to either get 2 wood or exchange up to 2 wood for 1 reed each.",
  onBeforeAction(game, player, actionId) {
    if (actionId === 'fencing' || actionId === 'build-rooms') {
      game.actions.offerWoodBartererChoice(player, this)
    }
  },
}
