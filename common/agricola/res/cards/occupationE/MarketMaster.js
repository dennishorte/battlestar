module.exports = {
  id: "market-master-e131",
  name: "Market Master",
  deck: "occupationE",
  number: 131,
  type: "occupation",
  players: "1+",
  text: "Immediately after each time you place your last person in a round on the \"Traveling Players\" accumulation space, you can play 1 occupation for an occupation cost of 1 food.",
  onAction(game, player, actionId) {
    const targetAction = game.players.count() === 3 ? 'resource-market' : 'traveling-players'
    if (actionId === targetAction && player.isLastPersonPlaced()) {
      game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
    }
  },
}
