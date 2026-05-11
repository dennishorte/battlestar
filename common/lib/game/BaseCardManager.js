const fs = require('fs')
const path = require('path')
const { GameProxy } = require('./GameProxy.js')

class BaseCardManager {
  constructor(game) {
    this.game = game
    this.reset()

    return GameProxy.create(this)
  }

  register(card) {
    if (card.id in this._cards) {
      throw new Error('Duplicate card ids: ' + card.id)
    }
    this._cards[this._getCardId(card)] = card
  }

  all() {
    return Object.values(this._cards)
  }

  byId(id) {
    if (!Object.hasOwn(this._cards, id)) {
      throw new Error('Unknown card: ' + id)
    }
    return this._cards[id]
  }

  byPlayer(player, zoneName) {
    return this.zones.byPlayer(player, zoneName).cardlist()
  }

  byZone(zoneId) {
    return this.zones.byId(zoneId).cardlist()
  }

  hasId(id) {
    return (id in this._cards)
  }

  reset() {
    this._cards = {}
  }

  _getCardId(card) {
    return card.id
  }

  // Walk a directory and require every .js file that isn't a test or index.
  // Replaces hand-maintained per-card-type index.js files. Sorted readdir
  // makes the resulting array order deterministic across filesystems.
  static loadFromDirectory(dirPath, { skip = /\.test\.js$/, requireSource = true } = {}) {
    const defs = []
    for (const entry of fs.readdirSync(dirPath).sort()) {
      if (entry === 'index.js') {
        continue
      }
      if (!entry.endsWith('.js')) {
        continue
      }
      if (skip.test(entry)) {
        continue
      }
      const def = require(path.join(dirPath, entry))
      if (requireSource && !def.source) {
        throw new Error(`Card definition ${path.join(dirPath, entry)} is missing required 'source' field`)
      }
      defs.push(def)
    }
    return defs
  }

  // Pure filter predicate over card definitions. Settings-driven source
  // selection belongs in the game class; callers pass the resolved sources.
  static filterDefinitions(defs, { sources, tags } = {}) {
    return defs.filter(def => {
      if (sources && !sources.includes(def.source)) {
        return false
      }
      if (tags && !def.tags?.some(t => tags.includes(t))) {
        return false
      }
      return true
    })
  }
}

module.exports = {
  BaseCardManager,
}
