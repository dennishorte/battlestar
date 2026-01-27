const { BasePlayerManager } = require('../lib/game/index.js')
const { AgricolaPlayer } = require('./AgricolaPlayer.js')


class AgricolaPlayerManager extends BasePlayerManager {
  constructor(game, users, opts={}) {
    opts = Object.assign(opts, {
      playerClass: AgricolaPlayer,
    })
    super(game, users, opts)
  }
}

module.exports = {
  AgricolaPlayerManager,
}
