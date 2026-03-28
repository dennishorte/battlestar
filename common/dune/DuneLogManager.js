const { BaseLogManager } = require('../lib/game/index.js')

class DuneLogManager extends BaseLogManager {
  constructor(game, chat, viewerName) {
    super(game, chat, viewerName)

    this.registerHandler('card*', (card) => ({
      value: card.name || card,
      classes: ['card-name'],
    }))

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
