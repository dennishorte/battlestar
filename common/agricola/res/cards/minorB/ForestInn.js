module.exports = {
  id: "forest-inn-b042",
  name: "Forest Inn",
  deck: "minorB",
  number: 42,
  type: "minor",
  cost: { clay: 1, reed: 1 },
  vps: 1,
  prereqs: { maxRound: 6 },
  category: "Actions Booster",
  text: "This is an action space for all. A player who uses it can exchange 5/7/9 wood for 8 wood and 2/4/7 food. When another player uses it, they must first pay you 1 food.",
  providesActionSpace: true,
  actionSpaceId: "forest-inn",
  onActionSpaceUsed(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name) {
      if (actingPlayer.food >= 1) {
        actingPlayer.removeResource('food', 1)
        cardOwner.addResource('food', 1)
        game.log.add({
          template: '{actingPlayer} pays 1 food to {owner} to use Forest Inn',
          args: { actingPlayer, owner: cardOwner },
        })
      }
    }
    game.actions.forestInnExchange(actingPlayer, this)
  },
}
