module.exports = {
  id: "assistant-tiller-b091",
  name: "Assistant Tiller",
  deck: "occupationB",
  number: 91,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Day Laborer\" action space, you can also plow 1 field.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      game.actions.offerPlow(player, this)
    }
  },
}
