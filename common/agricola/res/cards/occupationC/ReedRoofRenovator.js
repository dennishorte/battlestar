module.exports = {
  id: "reed-roof-renovator-c144",
  name: "Reed Roof Renovator",
  deck: "occupationC",
  number: 144,
  type: "occupation",
  players: "3+",
  text: "Each time another player renovates, you immediately get 1 reed from the general supply. When you play this card in a 3-player game, you immediately get 1 reed.",
  onPlay(game, player) {
    if (game.players.all().length === 3) {
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from {card}',
        args: { player , card: this},
      })
    }
  },
  onAnyRenovate(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name) {
      cardOwner.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from {card}',
        args: { player: cardOwner , card: this},
      })
    }
  },
}
