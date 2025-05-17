const { Player } = require('../../lib/game/Player.js')


class CubeDraftPlayer extends Player {
  constructor(game, data) {
    super(game, data)

    this.deckId = data.deckId
    this.draftCompelete = false
    this.picked = []
    this.waitingPacks = []
    this.nextRoundPacks = []
    this.unopenedPacks = []
    this.scarredRounds = []
  }
}


module.exports = { CubeDraftPlayer }
