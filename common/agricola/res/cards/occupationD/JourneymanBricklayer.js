module.exports = {
  id: "journeyman-bricklayer-d163",
  name: "Journeyman Bricklayer",
  deck: "occupationD",
  number: 163,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 2 stone. Each time another player renovates to stone or builds a stone room, you get 1 stone.",
  onPlay(game, player) {
    player.addResource('stone', 2)
    game.log.add({
      template: '{player} gets 2 stone from Journeyman Bricklayer',
      args: { player },
    })
  },
  onAnyRenovate(game, actingPlayer, cardOwner, improvementBuilt, toType) {
    if (actingPlayer.name !== cardOwner.name && toType === 'stone') {
      cardOwner.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Journeyman Bricklayer',
        args: { player: cardOwner },
      })
    }
  },
  onAnyBuildRoom(game, actingPlayer, cardOwner, roomType) {
    if (actingPlayer.name !== cardOwner.name && roomType === 'stone') {
      cardOwner.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Journeyman Bricklayer',
        args: { player: cardOwner },
      })
    }
  },
}
