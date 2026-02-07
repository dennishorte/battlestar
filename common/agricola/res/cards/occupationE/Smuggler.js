module.exports = {
  id: "smuggler-e142",
  name: "Smuggler",
  deck: "occupationE",
  number: 142,
  type: "occupation",
  players: "1+",
  text: "In the feeding phase of each harvest, you can exchange up to 2 goods as follows: 1 wood to 1 grain and/or 1 grain to 1 stone.",
  onFeedingPhase(game, player) {
    game.actions.offerSmugglerExchange(player, this)
  },
}
