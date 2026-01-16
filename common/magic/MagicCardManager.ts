const { BaseCardManager } = require('../lib/game/index.js')

import type { BaseCardManager as BaseCardManagerType } from '../lib/game/index.js'

class MagicCardManager extends BaseCardManager {
  constructor(...args: unknown[]) {
    super(...args)
  }
}

module.exports = {
  MagicCardManager,
}

export { MagicCardManager }
