module.exports = {
  id: "new-market-d055",
  name: "New Market",
  deck: "minorD",
  number: 55,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you use an action space card on round spaces 8 to 11, you get 1 additional food.",
  onAction(game, player, actionId) {
    const round = game.state.round
    if (round >= 8 && round <= 11 && game.isRoundActionSpace(actionId)) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from New Market',
        args: { player },
      })
    }
  },
}
