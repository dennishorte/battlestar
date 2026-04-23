const { BaseLogManager } = require('../lib/game/index.js')

class DuneLogManager extends BaseLogManager {
  constructor(game, chat, viewerName) {
    super(game, chat, viewerName)

    this.registerHandler('card*', (card) => {
      if (typeof card === 'string') {
        return { value: card, classes: ['card-name'] }
      }
      // Carry the card's identifiers through so the log UI can resolve the
      // right card definition for the click-to-inspect modal, even when
      // multiple decks share a display name (e.g. imperium + conflict
      // "Desert Power"). `cardId` drives GameLog's card(...) token — when
      // set, CardName resolves it via game.cards.byId to recover the full
      // instance (including its definition) rather than guessing by name.
      return {
        value: card.name,
        classes: ['card-name'],
        cardId: card.id || null,
        defId: card.defId || card.data?.defId || null,
      }
    })

    this.registerHandler('faction*', (faction) => ({
      value: typeof faction === 'string' ? faction : faction.name,
      classes: ['faction-name'],
    }))

    this.registerHandler('resource*', (resource) => ({
      value: resource,
      classes: ['resource-name'],
    }))

    this.registerHandler('boardSpace*', (space) => ({
      value: typeof space === 'string' ? space : space.name,
      classes: ['board-space-name'],
    }))

    this.registerHandler('leader*', (leader) => ({
      value: typeof leader === 'string' ? leader : leader.name,
      classes: ['leader-name'],
    }))
  }
}

module.exports = { DuneLogManager }
