module.exports = {
  id: "fishing-net-c051",
  name: "Fishing Net",
  deck: "minorC",
  number: 51,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  category: "Food Provider",
  text: "Each time another player uses the \"Fishing\" accumulation space, they must first pay you 1 food. Then, in the returning home phase of that round, place 2 food on \"Fishing\".",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'fishing' && actingPlayer.name !== cardOwner.name) {
      if (actingPlayer.food >= 1) {
        actingPlayer.payCost({ food: 1 })
        cardOwner.addResource('food', 1)
        game.log.add({
          template: '{acting} pays 1 food to {owner} for Fishing Net',
          args: { acting: actingPlayer, owner: cardOwner },
        })
        // Schedule 2 food to be added to Fishing in returning home phase
        if (!game.state.fishingNetBonus) {
          game.state.fishingNetBonus = 0
        }
        game.state.fishingNetBonus += 2
      }
    }
  },
}
