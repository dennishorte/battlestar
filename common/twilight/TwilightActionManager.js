const { BaseActionManager } = require('../lib/game/index.js')

const TRANSACTION_TITLES = [
  'Propose Transaction',
  'Offer to',
  'Counter-offer to',
  'Transaction from',
  'Counter-offer from',
]

class TwilightActionManager extends BaseActionManager {
  constructor(game) {
    super(game)
  }

  choose(player, choices, opts = {}) {
    // During the active player's turn, inject "Propose Transaction" into every
    // non-transaction choice prompt so the player can transact at any time.
    while (true) {
      const shouldInject = this._shouldInjectTransaction(player, opts)

      let augmentedChoices = choices
      if (shouldInject) {
        augmentedChoices = [...choices, 'Propose Transaction']
      }

      const result = super.choose(player, augmentedChoices, opts)

      // If the player selected a regular choice, return it
      if (!result || result.action || result[0] !== 'Propose Transaction') {
        return result
      }

      // Player chose to transact — run the transaction flow, then re-prompt
      this._handleTransaction(player)
    }
  }

  _shouldInjectTransaction(player, opts) {
    const title = opts.title || ''

    // Don't inject into transaction-related prompts (would cause infinite recursion)
    if (TRANSACTION_TITLES.some(t => title.startsWith(t) || title.includes(t))) {
      return false
    }

    // Only during action phase and for the active turn player
    if (this.game.state.phase !== 'action') {
      return false
    }
    if (player.name !== this.game.state.turnPlayerName) {
      return false
    }

    // Must have available trade partners with resources
    const partners = this.game._getAvailableTradePartners(player)
    if (partners.length === 0) {
      return false
    }

    const hasResources = player.tradeGoods > 0 || player.commodities > 0
    const partnerHasResources = partners.some(n => {
      const p = this.game.players.byName(n)
      return p.tradeGoods > 0 || p.commodities > 0
    })
    if (!hasResources && !partnerHasResources) {
      return false
    }

    return true
  }

  _handleTransaction(player) {
    const partners = this.game._getAvailableTradePartners(player)
    if (partners.length === 0) {
      return
    }

    // Use super.choose to avoid re-injecting "Propose Transaction"
    const selection = super.choose(player, ['Cancel', ...partners], {
      title: 'Propose Transaction',
    })

    const targetName = selection[0]
    if (targetName === 'Cancel') {
      return
    }

    this.game._resolveTransaction(player, targetName)
  }
}

module.exports = { TwilightActionManager }
