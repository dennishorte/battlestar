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

    if (cardId === this.scarredCardId) {
      return false
    }

    const pack = this.waitingPacks[0]
    if (!pack) {
      return false
    }

    const packCard = pack.getCardById(cardId)
    if (!packCard || !pack.checkCardIsAvailable(packCard)) {
      return false
    }

    return true
  }
}


module.exports = { CubeDraftPlayer }
