const util = require('../util.js')

class BaseZoneManager {
  constructor(game) {
    this._game = game
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Getters

  byCard(card) {
    return card.zone
  }

  byId(id) {
    const tokens = id.split('.')
    let curr = this.state.zones
    for (const token of tokens) {
      util.assert(Object.hasOwn(curr, token), `Invalid zone id ${id} at token ${token}`)
      curr = curr[token]
    }
    return curr
  }
}

module.exports = {
  BaseZoneManager,
}
