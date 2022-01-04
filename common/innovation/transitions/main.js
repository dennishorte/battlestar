// Just endlessly repeat.
module.exports = function(context) {
  const { game } = context

  // Check if this should increase the current turn index.
  game.rk.increment(game.state.turn, 'count')
  if (game.getTurnCount() % game.getPlayerAll().length === 1) {
    game.rk.increment(game.state.turn, 'round')
  }

  // Start the next player's turn.
  context.push('player-turn', {
    playerName: game.getPlayerCurrentTurn().name,
  })
}
