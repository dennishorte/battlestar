module.exports = {
  id: "lieutenant-general-b159",
  name: "Lieutenant General",
  deck: "occupationB",
  number: 159,
  type: "occupation",
  players: "4+",
  text: "For each field tile that another player places next to an existing field tile, you get 1 food from the general supply. In round 14, you get 1 grain instead.",
  onAnyPlowField(game, actingPlayer, cardOwner, isAdjacent) {
    if (actingPlayer.name !== cardOwner.name && isAdjacent) {
      if (game.state.round === 14) {
        cardOwner.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Lieutenant General',
          args: { player: cardOwner },
        })
      }
      else {
        cardOwner.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Lieutenant General',
          args: { player: cardOwner },
        })
      }
    }
  },
}
