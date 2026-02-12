module.exports = {
  id: "barn-shed-e066",
  name: "Barn Shed",
  deck: "minorE",
  number: 66,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 3 },
  text: "Each time another player uses the \"Forest\" accumulation space, you get 1 grain.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-wood' && actingPlayer.name !== cardOwner.name) {
      cardOwner.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Barn Shed',
        args: { player: cardOwner },
      })
    }
  },
}
