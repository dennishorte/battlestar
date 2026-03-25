module.exports = {
  id: "assistant-tiller-b091",
  name: "Assistant Tiller",
  deck: "occupationB",
  number: 91,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Day Laborer\" action space, you can also plow 1 field.",
  matches_onAction(game, player, actionId) {
    return actionId === 'day-laborer'
  },
  onAction(game, player, _actionId) {
    game.actions.offerPlow(player, this)
  },
}
