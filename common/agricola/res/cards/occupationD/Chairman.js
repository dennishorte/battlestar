module.exports = {
  id: "chairman-d139",
  name: "Chairman",
  deck: "occupationD",
  number: 139,
  type: "occupation",
  players: "1+",
  text: "Each time another player uses the \"Meeting Place\" action space, both they and you get 1 food (before taking the actions). If you use it, you get 1 food.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'starting-player') {
      cardOwner.addResource('food', 1)
      if (actingPlayer.name !== cardOwner.name) {
        actingPlayer.addResource('food', 1)
        game.log.add({
          template: '{player} and {other} each get 1 food from Chairman',
          args: { player: cardOwner, other: actingPlayer },
        })
      }
      else {
        game.log.add({
          template: '{player} gets 1 food from Chairman',
          args: { player: cardOwner },
        })
      }
    }
  },
}
