const { PlayerManager } = require('../../lib/game/PlayerManager.js')
const { CubeDraftPlayer } = require('./CubeDraftPlayer.js')


class CubeDraftPlayerManager extends PlayerManager {
  constructor(game, users, opts={}) {
    opts.playerClass = CubeDraftPlayer
    super(game, users, opts)
  }
}


module.exports = { CubeDraftPlayerManager }
