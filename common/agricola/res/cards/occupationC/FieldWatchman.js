module.exports = {
  id: "field-watchman-c090",
  name: "Field Watchman",
  deck: "occupationC",
  number: 90,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Grain Seeds\" action space, you can also plow 1 field.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain') {
      game.actions.offerPlow(player, this)
    }
  },
}
