const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'chooseLocation',
      func: _makeChoices,
      resp: _move
    }
  ]
})

function _makeChoices(context) {
  const game = context.state
  const options = game
    .getLocationsByArea('Galactica')
    .filter(l => !l.details.hazardous)
    .map(l => l.details.name)

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: 'Leave Brig: Choose Location',
      options,
    }]
  })
}

function _move(context) {
  const game = context.state
  const locationName = context.response.option[0]
  const location = game.getZoneByLocationName(locationName)
  game.mLog({
    template: "{player} moves to {location}",
    args: {
      player: context.data.playerName,
      location: locationName,
    }
  })
  game.mMovePlayer(player, location)
}
