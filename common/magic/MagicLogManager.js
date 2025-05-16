const { LogManager } = require('../lib/game/LogManager.js')


class MagicLogManager extends LogManager {
  addStackPush(player, card) {
    this.add('{player} puts {card} on the stack', { player, card }, ['stack-push'])
  }
}


module.exports = MagicLogManager
