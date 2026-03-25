module.exports = {
  id: "market-master-e131",
  name: "Market Master",
  deck: "occupationE",
  number: 131,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you place your last person in a round on the \"Traveling Players\" accumulation space, you can play 1 occupation for an occupation cost of 1 food.",
  matches_onAction(game, player, actionId) {
    return actionId === 'traveling-players' || actionId === 'traveling-players-5'
  },
  onAction(game, player, _actionId) {
    if (player.availableWorkers <= 0) {
      game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
    }
  },
}
