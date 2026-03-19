const { BasePlayerManager } = require('../lib/game/index.js')
const { TwilightPlayer } = require('./TwilightPlayer.js')


class TwilightPlayerManager extends BasePlayerManager {
  constructor(game, users, opts = {}) {
    opts = Object.assign(opts, {
      playerClass: TwilightPlayer,
    })
    super(game, users, opts)
  }
}

module.exports = { TwilightPlayerManager }
