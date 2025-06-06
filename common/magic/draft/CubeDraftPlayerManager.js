const { BasePlayerManager } = require('../../lib/game/BasePlayerManager.js')
const { CubeDraftPlayer } = require('./CubeDraftPlayer.js')


class CubeDraftPlayerManager extends BasePlayerManager {
  constructor(game, users, opts={}) {
    opts.playerClass = CubeDraftPlayer
    super(game, users, opts)
  }
}


module.exports = { CubeDraftPlayerManager }
