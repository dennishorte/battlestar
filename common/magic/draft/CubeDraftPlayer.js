const { BasePlayer } = require('../../lib/game/index.js')


class CubeDraftPlayer extends BasePlayer {
  constructor(game, data) {
    super(game, data)

    this.deckId = data.deckId
    this.draftCompelete = false
    this.scarredCardId = null

    this.picked = []
    this.waitingPacks = []
    this.nextRoundPacks = []
    this.unopenedPacks = []
    this.scarredRounds = []
  }

  canDraft(card) {
    const cardId = typeof card === 'string' ? card : card.id
    return cardId !== this.scarredCardId
  }
}


module.exports = { CubeDraftPlayer }
