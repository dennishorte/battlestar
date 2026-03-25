module.exports = {
  id: "field-watchman-c090",
  name: "Field Watchman",
  deck: "occupationC",
  number: 90,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Grain Seeds\" action space, you can also plow 1 field.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain'
  },
  onAction(game, player, _actionId) {
    game.actions.offerPlow(player, this)
  },
}
