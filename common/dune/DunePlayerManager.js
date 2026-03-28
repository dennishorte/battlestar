const { BasePlayerManager } = require('../lib/game/index.js')
const { DunePlayer } = require('./DunePlayer.js')

class DunePlayerManager extends BasePlayerManager {
  constructor(game, users, opts = {}) {
    super(game, users, {
      ...opts,
      playerClass: DunePlayer,
    })
  }
}

module.exports = { DunePlayerManager }
