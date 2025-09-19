const { BasePlayerManager } = require('../lib/game/index.js')
const { UltimatePlayer } = require('./UltimatePlayer.js')


class UltimatePlayerManager extends BasePlayerManager {
  constructor(game, users, opts={}) {
    super(game, users, {
      playerClass: UltimatePlayer,
    })
  }
}
