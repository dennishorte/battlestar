module.exports.GameOverEvent = require('./lib/game.js').GameOverEvent


// Backwards compatibility
module.exports.mag = require('./magic/magic.js')
module.exports.tyr = require('./tyrants/tyrants.js')

// New games, use longer name
module.exports.magic = require('./magic/magic.js')
module.exports.tyrants = require('./tyrants/tyrants.js')
module.exports.ultimate = require('./ultimate/innovation.js')

module.exports.log = require('./lib/log.js')
module.exports.selector = require('./lib/selector.js')
module.exports.util = require('./lib/util.js')


const Games = {
  'Innovation: Ultimate': module.exports.ultimate,
  'Magic': module.exports.magic,
  'Tyrants of the Underdark': module.exports.tyrants,
  'Set Draft': module.exports.magic.draft.cube,
  'Cube Draft': module.exports.magic.draft.cube,
}

module.exports.fromData = function(gameData, viewerName) {
  const name = gameData.settings.game
  if (name in Games) {
    const constructor = Games[name].constructor
    return new constructor(gameData, viewerName)
  }
  else {
    throw new Error(`No constructor for game: ${name}`)
  }
}

module.exports.fromLobby = function(lobby) {
  const name = lobby.game
  if (name in Games) {
    const factory = Games[name].factory
    return factory(lobby)
  }
  else {
    throw new Error(`No factory for game: ${name}`)
  }
}
