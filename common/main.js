module.exports.GameOverEvent = require('./lib/game.js').GameOverEvent


// Backwards compatibility
module.exports.inn = require('./innovation/innovation.js')
module.exports.mag = require('./magic/magic.js')
module.exports.tyr = require('./tyrants/tyrants.js')

// New games, use longer name
module.exports.innovation = require('./innovation/innovation.js')
module.exports.magic = require('./magic/magic.js')
module.exports.tyrants = require('./tyrants/tyrants.js')

module.exports.log = require('./lib/log.js')
module.exports.selector = require('./lib/selector.js')
module.exports.util = require('./lib/util.js')


const Games = {
  'Innovation': module.exports.innovation,
  'Magic': module.exports.magic,
  'Tyrants of the Underdark': module.exports.tyrants,
  'Set Draft': module.exports.magic.draft.cube_draft,
  'Cube Draft': module.exports.magic.draft.cube_draft,
  'CubeDraft': module.exports.magic.draft.cube_draft,
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
