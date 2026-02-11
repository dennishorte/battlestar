module.exports = {
  id: "final-scenario-b023",
  name: "Final Scenario",
  deck: "minorB",
  number: 23,
  type: "minor",
  cost: {},
  prereqs: { maxRound: 13 },
  category: "Actions Booster",
  text: "Place the action space card for round 14 face up in front of you. Only you can use it until it is placed on the game board.",
  providesActionSpace: true,
  ownerOnly: true,
  actionSpaceId: "final-scenario",
  canUseActionSpace(game, _actingPlayer, _cardOwner) {
    return game.state.round < 14
  },
  onActionSpaceUsed(game, player, _cardOwner) {
    game.actions.renovationAndOrFencing(player)
  },
}
