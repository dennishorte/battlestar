module.exports = {
  id: "chapel-a039",
  name: "Chapel",
  deck: "minorA",
  number: 39,
  type: "minor",
  cost: { wood: 3, clay: 2 },
  vps: 3,
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "This is an action space for all. A player who uses it gets 3 bonus points. If another player uses it, they must first pay you 1 grain.",
  providesActionSpace: true,
  actionSpaceId: "chapel",
  canUseActionSpace(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name) {
      return actingPlayer.grain >= 1
    }
    return true
  },
  onActionSpaceUsed(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name) {
      actingPlayer.payCost({ grain: 1 })
      cardOwner.addResource('grain', 1)
      game.log.add({
        template: '{actingPlayer} pays 1 grain to {owner} to use Chapel',
        args: { actingPlayer, owner: cardOwner },
      })
    }
    actingPlayer.addBonusPoints(3)
    game.log.add({
      template: '{player} gets 3 bonus points from Chapel',
      args: { player: actingPlayer },
    })
  },
}
