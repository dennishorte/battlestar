const { BasePlayer } = require('../lib/game/index.js')


class UltimatePlayer extends BasePlayer {
  biscuits() {
    const boardBiscuits = this
      .game
      .zones
      .colorStacks(this)
      .map(zone => zone.biscuits())
      .reduce((l, r) => this.game.util.combineBiscuits(l, r))

    return this
      .game
      .getInfoByKarmaTrigger(this, 'calculate-biscuits')
      .map(info => this.game.aCardEffect(this, info, { biscuits: boardBiscuits }))
      .reduce((l, r) => this.game.util.combineBiscuits(l, r), boardBiscuits)
  }

  biscuitsByColor() {
    const output = {}
    for (const color of this.game.util.colors()) {
      output[color] = this.zones.byPlayer(this, color).biscuits()
    }
    return output
  }

  isOpponent(other) {
    return this.team !== other.team
  }
}

module.exports = {
  UltimatePlayer,
}
