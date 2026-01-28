/**
 * EffectMixin - Card effect execution system for Innovation
 *
 * This mixin handles the execution of card effects (dogma, echo, karma effects)
 * including the sharing/demanding logic and chain rule achievement tracking.
 *
 * Public API:
 *   - executeEffect(player, info, opts) - Execute a single card effect
 *   - executeDogmaEffect(player, card, text, impl, opts) - Execute one effect with sharing/demanding
 *   - executeAllEffects(player, card, kind, opts) - Execute all effects of a kind on a card
 *   - trackChainRule(player, card) - Track chain rule for achievement
 *   - finishChainEvent(player, card) - Finish chain event tracking
 *   - checkEffectIsVisible(card) - Check if card has visible dogma/echo effects
 *   - getEffectAge(card, age) - Get age for effect with karma adjustments
 *   - getEffectByText(card, text) - Find effect implementation by text
 *   - getVisibleEffectsByColor(player, color, kind) - Get visible effects for a color
 *
 * Usage: Object.assign(Innovation.prototype, EffectMixin)
 */

const EffectMixin = {

  /**
   * Execute a single card effect.
   *
   * @param {Object} player - The player executing the effect
   * @param {Object} info - Effect info containing card, impl, and text
   * @param {Object} opts - Additional options (leader, self, etc.)
   * @returns {*} Result of the effect function
   */
  executeEffect(player, info, opts = {}) {
    const prevLeader = this.state.dogmaInfo.effectLeader
    if (opts.leader) {
      this.state.dogmaInfo.effectLeader = opts.leader
    }

    const fn = typeof info.impl === 'function' ? info.impl : info.impl.func
    const result = fn(this, player, { self: info.card, ...opts })

    if (opts.leader) {
      this.state.dogmaInfo.effectLeader = prevLeader
    }

    return result
  },

  /**
   * Execute one effect text, handling sharing and demanding logic.
   * This is the main entry point for executing dogma/echo effects.
   *
   * @param {Object} player - The player who initiated the effect
   * @param {Object} card - The card whose effect is being executed
   * @param {string} text - The effect text
   * @param {Function|Object} impl - The effect implementation
   * @param {Object} opts - Options including sharing, demanding, leader, endorsed, foreseen
   */
  executeDogmaEffect(player, card, text, impl, opts = {}) {
    opts = {
      sharing: [],
      demanding: [],
      leader: player,
      endorsed: false,
      foreseen: false,
      ...opts,
    }

    const repeatCount = opts.endorsed ? 2 : 1
    const actors = this._getEffectActors(player, opts)

    for (const actor of actors) {
      this.state.dogmaInfo.acting = actor

      for (let z = 0; z < repeatCount; z++) {
        const participation = this._determineParticipation(player, actor, text, opts, z)

        if (participation.shouldExecute) {
          this._executeEffectForActor(player, actor, card, text, impl, opts, participation)

          if (this.state.dogmaInfo.earlyTerminate) {
            this.log.add({ template: 'Dogma action is complete' })
            this.state.dogmaInfo.acting = undefined
            return
          }
        }
      }
      this.state.dogmaInfo.acting = undefined
    }
  },

  /**
   * Execute all effects of a given kind (dogma/echo) on a card.
   *
   * @param {Object} player - The player executing the effects
   * @param {Object} card - The card whose effects to execute
   * @param {string} kind - The kind of effects ('dogma' or 'echo')
   * @param {Object} opts - Additional options
   */
  executeAllEffects(player, card, kind, opts = {}) {
    const effects = card.visibleEffects(kind, opts)
    if (!effects) {
      return
    }

    const { texts, impls } = effects

    for (let i = 0; i < texts.length; i++) {
      this.executeDogmaEffect(player, card, texts[i], impls[i], opts)
      if (this.state.dogmaInfo.earlyTerminate) {
        return
      }
    }
  },

  /**
   * Track chain rule for achievement.
   * Called when a card self-executes its effects.
   *
   * @param {Object} player - The player
   * @param {Object} card - The card being tracked
   */
  trackChainRule(player, card) {
    if (!this.state.dogmaInfo.chainRule) {
      this.state.dogmaInfo.chainRule = {}
    }
    if (!this.state.dogmaInfo.chainRule[player.name]) {
      this.state.dogmaInfo.chainRule[player.name] = {}
    }

    const data = this.state.dogmaInfo.chainRule[player.name]

    // This is the first card in a potential chain event.
    if (!data.cardName) {
      data.cardName = card.name
    }
    // A second card is calling self-execute. Award the chain achievement (once per chain).
    else if (data.cardName !== card.name && !data.awarded) {
      data.awarded = true
      this.log.add({
        template: '{player} achieves a Chain Achievement because {card} is recursively self-executing',
        args: { player, card }
      })
      const achievement = this.zones.byDeck('base', 11).cardlist()[0]
      if (achievement) {
        this.actions.claimAchievement(player, achievement)
      }
      else {
        this.log.add({ template: 'There are no cards left in the 11 deck to achieve.' })
      }
    }
  },

  /**
   * Finish chain event tracking.
   * Called when a card's dogma action completes.
   *
   * @param {Object} player - The player
   * @param {Object} card - The card
   */
  finishChainEvent(player, card) {
    const data = this.state.dogmaInfo.chainRule?.[player.name]
    if (!data) {
      return
    }

    // Got to the end of the dogma action for the original chain card.
    if (data.cardName === card.name) {
      delete this.state.dogmaInfo.chainRule[player.name]
    }
  },

  /**
   * Check if a card has visible dogma or echo effects.
   *
   * @param {Object} card - The card to check
   * @returns {boolean}
   */
  checkEffectIsVisible(card) {
    return card.visibleEffects('dogma') || card.visibleEffects('echo')
  },

  /**
   * Get the effective age for an effect, considering karma adjustments.
   *
   * @param {Object} card - The card
   * @param {number} age - The base age
   * @returns {number} The adjusted age
   */
  getEffectAge(card, age) {
    const player = this.players.byOwner(card)

    if (player) {
      const karmaInfos = this.findKarmasByTrigger(player, 'effect-age')
      if (karmaInfos.length === 0) {
        // No karma, so use age as is
      }
      else if (karmaInfos.length > 1) {
        throw new Error('Multiple effect-age karmas not supported')
      }
      else {
        age = karmaInfos[0].impl.func(this, player, card, age)
      }
    }

    if (this.state.dogmaInfo.globalAgeIncrease) {
      age += this.state.dogmaInfo.globalAgeIncrease
    }

    return age
  },

  /**
   * Find an effect implementation by its text.
   *
   * @param {Object} card - The card to search
   * @param {string} text - The effect text to find
   * @returns {Function} The effect implementation
   * @throws {Error} If effect is not found
   */
  getEffectByText(card, text) {
    for (const kind of ['dogma', 'echo']) {
      const effects = card.visibleEffects(kind)
      if (!effects) {
        continue
      }
      const { texts, impls } = effects
      const index = texts.indexOf(text)
      if (index !== -1) {
        return impls[index]
      }
    }

    throw new Error(`Effect not found on ${card.name} for text ${text}`)
  },

  /**
   * Get visible effects for a player's color stack.
   *
   * @param {Object} player - The player
   * @param {string} color - The color
   * @param {string} kind - The kind of effects ('dogma' or 'echo')
   * @returns {Array} Array of visible effects
   */
  getVisibleEffectsByColor(player, color, kind) {
    const karma = this.findKarmasByTrigger(player, `list-${kind}-effects`)

    if (karma.length === 1) {
      return this.withKarmaDepth(() => {
        return karma.flatMap(info => info.impl.func(this, player, { color, kind }))
      })
    }
    else if (karma.length >= 2) {
      throw new Error(`Too many list-effect karmas`)
    }
    else {
      return this.cards
        .byPlayer(player, color)
        .reverse()
        .map(card => card.visibleEffects(kind))
        .filter(effect => effect !== undefined)
    }
  },

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Get ordered list of actors who will execute an effect.
   */
  _getEffectActors(player, opts) {
    const actors = [player]
      .concat(opts.sharing)
      .concat(opts.demanding)

    return this.players
      .endingWith(player)
      .filter(p => actors.some(actor => actor.id === p.id))
  },

  /**
   * Determine how a player participates in an effect (demand, share, owner, etc.)
   */
  _determineParticipation(player, actor, text, opts, repeatIndex) {
    const isDemand = text.toLowerCase().startsWith('i demand')
    const isCompel = text.toLowerCase().startsWith('i compel')

    const demand = isDemand && opts.demanding.some(target => target.id === actor.id)
    const compel = isCompel && opts.sharing.some(target => target.id === actor.id) && actor !== player
    const share = !isDemand && !isCompel && !opts.noShare &&
                  opts.sharing.some(target => target.id === actor.id) && repeatIndex === 0
    const owner = !isDemand && !isCompel && actor.id === player.id

    return {
      isDemand,
      isCompel,
      demand,
      compel,
      share,
      owner,
      shouldExecute: compel || demand || share || owner,
    }
  },

  /**
   * Execute an effect for a specific actor.
   */
  _executeEffectForActor(player, actor, card, text, impl, opts, participation) {
    this.log.add({
      template: `{player}, {card}: ${text}`,
      classes: ['card-effect'],
      args: { player: actor, card }
    })
    this.log.indent()

    const effectInfo = { card, text, impl }

    // Handle demand/compel karma
    if (participation.demand || participation.compel) {
      this.state.dogmaInfo.isDemandEffect = true

      const karmaKind = this.triggerKarma(actor, 'demand-success', {
        card,
        effectInfo,
        leader: opts.leader
      })
      if (karmaKind === 'would-instead') {
        this.state.dogmaInfo.isDemandEffect = false
        this.actions.acted(player)
        this.log.outdent()
        return
      }
    }

    // Handle dogma-effect karma
    const dogmaEffectKarmaKind = this.triggerKarma(actor, 'dogma-effect', {
      ...opts,
      card,
      effect: function() {
        this.game.executeEffect(actor, effectInfo, {
          leader: opts.leader,
          self: card,
          foreseen: opts.foreseen,
        })
      }
    })
    if (dogmaEffectKarmaKind === 'would-instead') {
      this.acted(player)
      this.log.outdent()
      return
    }

    // Execute the actual effect
    this.executeEffect(actor, effectInfo, {
      leader: opts.leader,
      self: card,
      foreseen: opts.foreseen,
    })

    if (participation.demand || participation.compel) {
      this.state.dogmaInfo.isDemandEffect = false
    }

    this.log.outdent()
  },
}

module.exports = {
  EffectMixin,
}
