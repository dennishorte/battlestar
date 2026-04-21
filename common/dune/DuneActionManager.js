const { BaseActionManager } = require('../lib/game/index.js')

class DuneActionManager extends BaseActionManager {
  constructor(game) {
    super(game)
  }
}

module.exports = { DuneActionManager }
