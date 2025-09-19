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
      .map(info => this.game.aCardEffect(player, info, { biscuits: boardBiscuits }))
      .reduce((l, r) => this.game.util.combineBiscuits(l, r), boardBiscuits)
  }
}

module.exports = {
  UltimatePlayer,
}
