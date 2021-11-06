const { transitionFactory } = require('./factory.js')

module.exports = transitionFactory(
  {},
  generateOptions,
  handleResponse,
)

function generateOptions(context) {
  const game = context.state
  const playersNotInBrig = game
    .getPlayerAll()
    .filter(p => !game.checkPlayerIsRevealedCylon(p))
    .filter(p => game.getZoneByPlayerLocation(p).details.name !== 'Brig')
    .map(p => p.name)

  if (playersNotInBrig.length === 0) {
    game.rk.sessionStart(() => {
      game.mLog({ template: 'All humans are already in the brig' })
    })
    return context.done()
  }

  else if (playersNotInBrig.length === 1) {
    game.rk.sessionStart(() => {
      game.mLog({
        template: '{player} is the only choice',
        args: {
          player: playersNotInBrig[0],
        }
      })
      game.mMovePlayer(playersNotInBrig[0], 'locations.brig')
    })
    return context.done()
  }
  else {
    return context.wait({
      actor: context.data.playerName,
      actions: [{
        name: 'Choose Player',
        description: 'Chosen player will be moved to the brig',
        options: playersNotInBrig
      }]
    })
  }
}

function handleResponse(context) {
  const game = context.state
  game.rk.sessionStart(() => {
    game.mLog({
      template: '{player1} sends {player2} to the brig',
      args: {
        player1: context.response.actor,
        player2: context.response.option[0],
      }
    })
    game.mMovePlayer(context.response.option[0], 'locations.brig')
  })
  return context.done()
}
