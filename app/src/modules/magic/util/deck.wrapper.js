const { mag } = require('battlestar-common')

class UIDeckWrapper extends mag.util.wrapper.deck {
  constructor(deck) {
    super(deck)
  }
}

module.exports = UIDeckWrapper
