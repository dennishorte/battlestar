module.exports = {
  id: "bassinet-a025",
  name: "Bassinet",
  deck: "minorA",
  number: 25,
  type: "minor",
  cost: { wood: 1, reed: 1 },
  category: "Actions Booster",
  text: "Each work phase, you can place a(nother) person on the first non-accumulating action space used by any player (including you), as long as there is only 1 person on that space.",
  onWorkPhaseStart(game, _player) {
    game.state.firstNonAccumulatingAction = null
    game.state.firstNonAccumulatingActionOccupants = 0
  },
  onAnyAction(game, _actingPlayer, actionId, _cardOwner) {
    if (game.state.firstNonAccumulatingAction === null) {
      const spaceState = game.state.actionSpaces[actionId]
      if (!spaceState.cardProvided && !('accumulated' in spaceState)) {
        game.state.firstNonAccumulatingAction = actionId
      }
    }
    if (actionId === game.state.firstNonAccumulatingAction) {
      game.state.firstNonAccumulatingActionOccupants++
    }
  },
  canUseOccupiedActionSpace(game, _player, actionId, _action, _state) {
    return actionId === game.state.firstNonAccumulatingAction
      && game.state.firstNonAccumulatingActionOccupants === 1
  },
}
