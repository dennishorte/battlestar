module.exports = {
  id: "margrave-e154",
  name: "Margrave",
  deck: "occupationE",
  number: 154,
  type: "occupation",
  players: "1+",
  text: "Once you live in a stone house, you get 2 food each time any player renovates and, during scoring, 1 bonus point for each wood house and clay house.",
  onAnyRenovate(game, actingPlayer, cardOwner) {
    if (cardOwner.roomType === 'stone') {
      cardOwner.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Margrave',
        args: { player: cardOwner },
      })
    }
  },
  getEndGamePoints(player, game) {
    if (player.roomType === 'stone') {
      return game.players.all().filter(p => p.roomType === 'wood' || p.roomType === 'clay').length
    }
    return 0
  },
}
