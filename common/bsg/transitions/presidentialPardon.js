const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'choose',
      func: _choose,
      resp: _chooseDo,
    },
    {
      name: 'move',
      func: _move,
      resp: _moveDo,
    },
  ],
})

function _choose(context) {
  const game = context.state
  const options = game
    .getPlayerAll()
    .filter(p => p.name !== context.data.playerName)
    .filter(p => game.getZoneByPlayerLocation(p).name === 'locations.brig')
    .map(p => p.name)

  if (options.length === 0) {
    game.mLog({ template: 'There is nobody to pardon' })
    context.done()
  }

  else if (options.length === 1) {
    _markPardon(context, options[0])
  }

  else {
    return context.wait({
      actor: context.data.playerName,
      name: 'Pardon Player',
      description: 'You can move the selected player from the brig to any other Galactica location',
      options,
    })
  }
}

function _chooseDo(context) {
  _markPardon(context, context.response.option[0])
}

function _markPardon(context, playerName) {
  const game = context.state
  game.rk.addKey(context.data, 'pardonedPlayerName', playerName)
  game.mLog({
    template: '{player1} grants {player2} a Presidential Pardon',
    args: {
      player1: context.data.playerName,
      player2: playerName,
    }
  })
}

function _move(context) {
  const game = context.state
  const options = game
    .getLocationsByArea('Galactica')
    .filter(l => !l.details.hazardous)
    .map(l => l.details.name)

  return context.wait({
    actor: context.data.playerName,
    name: 'Move Pardoned Player',
    description: `${context.data.pardonedPlayerName} will be moved to the selected location`,
    options,
  })
}

function _moveDo(context) {
  const game = context.state
  const locationName = context.response.option[0]
  const location = game.getZoneByLocationName(locationName)
  game.mLog({
    template: "{player} moves to {location}",
    args: {
      player: context.data.pardonedPlayerName,
      location: locationName,
    }
  })
  game.mMovePlayer(context.data.pardonedPlayerName, location)
  game.mDiscard(game.getCardByName('Presidential Pardon'))
}
