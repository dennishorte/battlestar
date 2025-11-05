const { BasePlayerManager } = require('../lib/game/index.js')
const { UltimatePlayer } = require('./UltimatePlayer.js')


class UltimatePlayerManager extends BasePlayerManager {
  constructor(game, users, opts={}) {
    opts = Object.assign(opts, {
      playerClass: UltimatePlayer,
    })
    super(game, users, opts)
  }
}

module.exports = {
  UltimatePlayerManager,
}
