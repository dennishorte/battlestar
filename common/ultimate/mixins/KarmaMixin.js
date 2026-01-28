/**
 * KarmaMixin - Interrupt/replacement system for Innovation
 *
 * The Karma system allows cards to intercept and modify game events.
 * Karmas can trigger on various game events (draw, meld, splay, etc.)
 * and can replace or modify the default behavior.
 *
 * Public API:
 *   - triggerKarma(player, trigger, opts) - Main entry point for triggering karma effects
 *   - findKarmasByTrigger(player, trigger) - Find all karmas that match a trigger
 *   - isExecutingKarma() - Check if currently inside a karma execution
 *
 * Usage: Object.assign(Innovation.prototype, KarmaMixin)
 */

const util = require('../../lib/util.js')

// Log message templates for "would" karma triggers
const WOULD_TRIGGER_MESSAGES = {
  'splay': '{player} would splay {color}, triggering...',
  'no-share': '{player} did not draw a sharing bonus, triggering...',
  'dogma': '{player} would take a Dogma action, triggering...',
  'draw': '{player} would draw a card, triggering...',
  'draw-action': '{player} would take a draw action, triggering...',
  'decree': '{player} would issue a decree, triggering...',
  'exchange': '{player} would exchange cards, triggering...',
}

const DEFAULT_WOULD_MESSAGE = '{player} would {trigger} {card}, triggering...'

const KarmaMixin = {

  /**
   * Trigger karma effects for a game event.
   *
   * @param {Object} player - The player triggering the karma
   * @param {string} trigger - The type of event (e.g., 'draw', 'meld', 'splay')
   * @param {Object} opts - Additional context for the karma
   * @param {Object} [opts.sourceCard] - If set, only karmas from this card are considered.
   *   Used by "when-meld" to ensure a card's karma only fires when that card itself is melded.
   * @returns {string|*} The karma kind ('would-instead', etc.) or effect result
   */
  triggerKarma(player, trigger, opts = {}) {
    const matchingKarmas = this._findAndFilterKarmas(player, trigger, opts)

    if (matchingKarmas.length === 0) {
      return undefined
    }

    const karma = this._resolveKarmaConflicts(matchingKarmas)
    return this._executeKarma(player, karma, { ...opts, trigger })
  },

  /**
   * Find all karma infos that match a trigger for a player.
   * Used by other systems that need to check for karma existence without triggering.
   *
   * @param {Object} player - The player to check karmas for
   * @param {string} trigger - The trigger type to search for
   * @returns {Array} Array of karma info objects
   */
  findKarmasByTrigger(player, trigger) {
    util.assert(typeof player.name === 'string', 'First parameter must be player object')
    util.assert(typeof trigger === 'string', 'Second parameter must be string.')

    // Karmas can't trigger while executing another karma (except list-* queries)
    if (this._shouldBlockKarmaTrigger(trigger)) {
      return []
    }

    const playerKarmas = this._getPlayerKarmas(player, trigger)
    const globalKarmas = this._getGlobalKarmas(player, trigger)

    return [...playerKarmas, ...globalKarmas]
      .map(info => ({ ...info, owner: this.players.byOwner(info.card) }))
  },

  /**
   * Check if currently executing a karma effect.
   * Prevents nested karma triggers.
   *
   * @returns {boolean}
   */
  isExecutingKarma() {
    return this.state.karmaDepth > 0
  },

  /**
   * Execute a function while tracking karma depth.
   * This prevents nested karma triggers during the execution.
   *
   * @param {Function} fn - The function to execute
   * @returns {*} The return value of the function
   */
  withKarmaDepth(fn) {
    this.state.karmaDepth += 1
    try {
      return fn()
    }
    finally {
      this.state.karmaDepth -= 1
    }
  },

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Find karmas and filter to those whose conditions match.
   * When opts.sourceCard is set, only karmas belonging to that card are considered.
   */
  _findAndFilterKarmas(player, trigger, opts) {
    let karmas = this.findKarmasByTrigger(player, trigger)
    if (opts.sourceCard) {
      karmas = karmas.filter(info => info.card === opts.sourceCard)
    }
    return karmas
      .filter(info => info.impl.matches)
      .filter(info => info.impl.matches(this, player, {
        ...opts,
        owner: info.owner,
        self: info.card
      }))
  },

  /**
   * When multiple karmas trigger, resolve which one executes.
   * Per rules: current player chooses which "would" karma occurs.
   */
  _resolveKarmaConflicts(karmas) {
    if (karmas.length === 1) {
      return karmas[0]
    }

    const firstKarma = karmas[0]
    const isWouldKarma = firstKarma.impl.kind?.startsWith('would')

    if (!isWouldKarma) {
      throw new Error('Multiple non-would karmas triggered simultaneously')
    }

    this.log.add({
      template: 'Multiple `would` karma effects would trigger, so {player} will choose one',
      args: { player: this.players.current() }
    })

    const cardChoices = karmas.map(k => k.card)
    const chosenCard = this.actions.chooseCard(
      this.players.current(),
      cardChoices,
      { title: 'Choose a would karma to trigger' }
    )

    return karmas.find(k => k.card === chosenCard)
  },

  /**
   * Execute a single karma effect.
   */
  _executeKarma(player, karma, opts) {
    const enrichedOpts = { ...opts, owner: karma.owner, self: karma.card }

    this._logKarmaTrigger(player, karma, enrichedOpts)
    this._logKarmaEffect(karma)

    this.log.indent()
    const result = this._runKarmaWithDepthTracking(player, karma, enrichedOpts)
    this.log.outdent()

    return this._getKarmaResult(karma, result)
  },

  /**
   * Log the "would X" trigger message for would-karmas.
   */
  _logKarmaTrigger(player, karma, opts) {
    if (!karma.impl.kind?.startsWith('would')) {
      return
    }

    const trigger = opts.trigger
    const template = WOULD_TRIGGER_MESSAGES[trigger]

    if (template) {
      // Known trigger - use specific template with appropriate args
      const args = { player }
      if (trigger === 'splay') {
        args.color = opts.direction
      }
      this.log.add({ template, args })
    }
    else {
      // Unknown trigger - use default template with card
      this.log.add({
        template: DEFAULT_WOULD_MESSAGE,
        args: { player, trigger, card: opts.card }
      })
    }
  },

  /**
   * Log which karma effect is executing.
   */
  _logKarmaEffect(karma) {
    this.log.add({
      template: '{card} karma: {text}',
      args: { card: karma.card, text: karma.text }
    })
  },

  /**
   * Execute the karma effect with proper depth tracking.
   */
  _runKarmaWithDepthTracking(player, karma, opts) {
    this.state.karmaDepth += 1
    try {
      return this.executeEffect(player, karma, opts)
    }
    finally {
      util.assert(this.state.karmaDepth > 0, 'Karma depth underflow')
      this.state.karmaDepth -= 1
    }
  },

  /**
   * Determine what to return from the karma execution.
   */
  _getKarmaResult(karma, effectResult) {
    const kind = karma.impl.kind
    if (kind === 'variable' || kind === 'game-over') {
      return effectResult
    }
    return kind
  },

  /**
   * Check if karma triggers should be blocked (when already in a karma).
   */
  _shouldBlockKarmaTrigger(trigger) {
    const isTriggeredKarma = !trigger.startsWith('list-') || trigger.endsWith('-effects')
    return isTriggeredKarma && this.isExecutingKarma()
  },

  /**
   * Get karmas from the player's own top cards.
   */
  _getPlayerKarmas(player, trigger) {
    return this.cards
      .tops(player)
      .flatMap(card => card.getKarmaInfo(trigger))
  },

  /**
   * Get global karmas from opponents' cards that trigger for all players.
   */
  _getGlobalKarmas(player, trigger) {
    return this.players
      .other(player)
      .flatMap(opp => this.cards.tops(opp))
      .flatMap(card => card.getKarmaInfo(trigger))
      .filter(info => info.impl.triggerAll)
  },

}

module.exports = {
  KarmaMixin,
}
