module.exports = {
  id: "lieutenant-general-b159",
  name: "Lieutenant General",
  deck: "occupationB",
  number: 159,
  type: "occupation",
  players: "4+",
  text: "For each field tile that another player places next to an existing field tile, you get 1 food from the general supply. In round 14, you get 1 grain instead.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actingPlayer.name === cardOwner.name) {
      return
    }
    if (actionId !== 'plow-field' && actionId !== 'plow-sow') {
      return
    }

    // Fields must be placed adjacent to existing fields (enforced by engine).
    // If the player has 2+ fields after plowing, the new field was adjacent.
    if (actingPlayer.getFieldCount() < 2) {
      return
    }

    if (game.state.round === 14) {
      cardOwner.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player: cardOwner , card: this},
      })
    }
    else {
      cardOwner.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player: cardOwner , card: this},
      })
    }
  },
}
