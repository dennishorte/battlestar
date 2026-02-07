module.exports = {
  id: "growing-farm-b052",
  name: "Growing Farm",
  deck: "minorB",
  number: 52,
  type: "minor",
  cost: { clay: 2, reed: 1 },
  vps: 2,
  prereqs: { pastureSpacesGteRound: true },
  category: "Food Provider",
  text: "You can only play this card if you have at least as many pasture spaces as the number of completed rounds. If you do, you get a number of food equal to the current round.",
  onPlay(game, player) {
    const food = game.state.round
    player.addResource('food', food)
    game.log.add({
      template: '{player} gets {amount} food from Growing Farm',
      args: { player, amount: food },
    })
  },
}
