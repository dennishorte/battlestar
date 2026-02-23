const { GameProxy } = require('../../lib/game/GameProxy.js')
const { getHandler } = require('./factions/index.js')


class FactionAbilities {
  constructor(game) {
    this.game = game
    return GameProxy.create(this)
  }

  // ---------------------------------------------------------------------------
  // Shared helper
  // ---------------------------------------------------------------------------

  _hasAbility(player, abilityId) {
    return player.faction?.abilities?.some(a => a.id === abilityId) ?? false
  }

  _getHandler(factionId) {
    return getHandler(factionId)
  }

  _getPlayerHandler(player) {
    return getHandler(player?.faction?.id)
  }


  // ---------------------------------------------------------------------------
  // A. Passive Modifiers — pure value queries, no mutation
  // ---------------------------------------------------------------------------

  getCombatModifier(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getCombatModifier?.(player, this) ?? 0
  }

  getStatusPhaseTokenBonus(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getStatusPhaseTokenBonus?.(player, this) ?? 0
  }

  canTradeWithNonNeighbors(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.canTradeWithNonNeighbors?.(player, this) ?? false
  }

  getTechPrerequisiteSkips(player, tech) {
    const handler = this._getPlayerHandler(player)
    return handler?.getTechPrerequisiteSkips?.(player, this, tech) ?? 0
  }

  onTechResearched(player, tech) {
    const handler = this._getPlayerHandler(player)
    handler?.onTechResearched?.(player, this, tech)
  }

  canTradeActionCards(player, target) {
    return !!(this._getPlayerHandler(player)?.canTradeActionCards?.(player, this, target) ||
              this._getPlayerHandler(target)?.canTradeActionCards?.(target, this, player))
  }

  canSkipTradeSecondaryCost(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.canSkipTradeSecondaryCost?.(player, this) ?? false
  }

  getActionCardHandLimit(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getActionCardHandLimit?.(player, this) ?? 7
  }

  getCustodiansCost(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getCustodiansCost?.(player, this) ?? 6
  }

  canMoveThroughSupernovae(playerName) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    return handler?.canMoveThroughSupernovae?.(player, this) ?? false
  }

  canMoveThroughNebulae(playerName) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    return handler?.canMoveThroughNebulae?.(player, this) ?? false
  }

  canResearchNormally(player) {
    const handler = this._getPlayerHandler(player)
    if (handler?.canResearchNormally) {
      return handler.canResearchNormally(player, this)
    }
    return true
  }

  getVotingModifier(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getVotingModifier?.(player, this) ?? 0
  }

  getExplorationBonus(player, planetId) {
    const handler = this._getPlayerHandler(player)
    return handler?.getExplorationBonus?.(player, this, planetId) ?? 0
  }

  getCapturedTokenFleetBonus(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getCapturedTokenFleetBonus?.(player, this) ?? 0
  }

  getMovementBonus(playerName, fromSystemId) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    return handler?.getMovementBonus?.(player, this, fromSystemId) ?? 0
  }

  getRaidFormationExcessHits(shooterName, totalHits, fightersDestroyed) {
    const player = this.players.byName(shooterName)
    const handler = this._getPlayerHandler(player)
    return handler?.getRaidFormationExcessHits?.(player, this, totalHits, fightersDestroyed) ?? 0
  }

  getHomeSystemWormholes(systemId) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      if (!handler?.getHomeSystemWormholes) {
        continue
      }
      const wormholes = handler.getHomeSystemWormholes(player, this, systemId)
      if (wormholes.length > 0) {
        return wormholes
      }
    }
    return []
  }


  // ---------------------------------------------------------------------------
  // B. Component Actions — data-driven registry
  // ---------------------------------------------------------------------------

  getAvailableComponentActions(player) {
    const handler = this._getPlayerHandler(player)
    if (!handler?.componentActions) {
      return []
    }
    return handler.componentActions
      .filter(h => this._hasAbility(player, h.abilityId) && h.isAvailable.call({ _game: this.game }, player))
      .map(h => ({ id: h.id, name: h.name }))
  }

  executeComponentAction(player, actionId) {
    const handler = this._getPlayerHandler(player)
    if (!handler?.componentActions) {
      return
    }
    const action = handler.componentActions.find(h => h.id === actionId)
    if (!action) {
      return
    }

    // Find the execute method name: id with hyphens → camelCase or direct method name
    const methodName = actionId.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    if (handler[methodName]) {
      handler[methodName](this, player)
    }
  }


  // ---------------------------------------------------------------------------
  // C. Combat Triggers — event-driven, called from space combat flow
  // ---------------------------------------------------------------------------

  onSpaceCombatStart(systemId, attacker, defender) {
    for (const [shooterName, targetName] of [[attacker, defender], [defender, attacker]]) {
      const player = this.players.byName(shooterName)
      const handler = this._getPlayerHandler(player)
      handler?.onSpaceCombatStart?.(player, this, { systemId, opponentName: targetName })
    }
  }

  onSpaceCombatRound(systemId, attacker, defender) {
    for (const [shooterName, targetName] of [[attacker, defender], [defender, attacker]]) {
      const player = this.players.byName(shooterName)
      const handler = this._getPlayerHandler(player)
      handler?.onSpaceCombatRound?.(player, this, { systemId, opponentName: targetName })
    }
  }

  afterSpaceCombatRound(systemId, attacker, defender) {
    for (const [shooterName, targetName] of [[attacker, defender], [defender, attacker]]) {
      const player = this.players.byName(shooterName)
      const handler = this._getPlayerHandler(player)
      handler?.afterSpaceCombatRound?.(player, this, { systemId, opponentName: targetName })
    }
  }

  onUnitsSustainedDamage(ownerName, systemId, count) {
    const player = this.players.byName(ownerName)
    const handler = this._getPlayerHandler(player)
    handler?.onUnitsSustainedDamage?.(player, this, { systemId, count })
  }


  // ---------------------------------------------------------------------------
  // D. Action Card Triggers
  // ---------------------------------------------------------------------------

  onActionCardDraw(player, drawn) {
    const handler = this._getPlayerHandler(player)
    handler?.onActionCardDraw?.(player, this, drawn)
  }


  // ---------------------------------------------------------------------------
  // E. Movement Triggers
  // ---------------------------------------------------------------------------

  onShipsEnterSystem(systemId, moverName) {
    for (const player of this.players.all()) {
      if (player.name === moverName) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      handler?.onShipsEnterSystem?.(player, this, { systemId, moverName })
    }
  }


  // ---------------------------------------------------------------------------
  // F. Transaction Triggers — called after trade completes
  // ---------------------------------------------------------------------------

  onTransactionComplete(transactionPlayer) {
    for (const player of this.players.all()) {
      if (player.name === transactionPlayer.name) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      handler?.onTransactionComplete?.(player, this, transactionPlayer)
    }
  }


  // ---------------------------------------------------------------------------
  // G. Ground Combat Triggers
  // ---------------------------------------------------------------------------

  onGroundCombatStart(systemId, planetId, attackerName, defenderName) {
    for (const [self, opponent] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const player = this.players.byName(self)
      const handler = this._getPlayerHandler(player)
      handler?.onGroundCombatStart?.(player, this, { systemId, planetId, opponentName: opponent })
    }
  }

  onGroundCombatRoundEnd(systemId, planetId, attackerName, defenderName) {
    for (const [self, opponent] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const player = this.players.byName(self)
      const handler = this._getPlayerHandler(player)
      handler?.onGroundCombatRoundEnd?.(player, this, { systemId, planetId, opponentName: opponent })
    }
  }


  // ---------------------------------------------------------------------------
  // H. Planet Gained Triggers
  // ---------------------------------------------------------------------------

  onPlanetGained(playerName, planetId, systemId, structureCounts) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    handler?.onPlanetGained?.(player, this, { planetId, systemId, structureCounts: structureCounts || {} })
  }


  // ---------------------------------------------------------------------------
  // I. Status Phase Triggers
  // ---------------------------------------------------------------------------

  onStatusPhaseStart(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStatusPhaseStart?.(player, this)
  }


  // ---------------------------------------------------------------------------
  // J. Diplomacy Triggers
  // ---------------------------------------------------------------------------

  afterDiplomacyResolved(player) {
    const handler = this._getPlayerHandler(player)
    handler?.afterDiplomacyResolved?.(player, this)
  }


  // ---------------------------------------------------------------------------
  // K. Agenda Triggers
  // ---------------------------------------------------------------------------

  onAgendaRevealed(agenda) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      if (!handler?.onAgendaRevealed) {
        continue
      }
      const replacement = handler.onAgendaRevealed(player, this, agenda)
      if (replacement) {
        return replacement
      }
    }
    return null
  }

  onAgendaVotingStart(agenda, outcomes) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onAgendaVotingStart?.(player, this, { agenda, outcomes })
    }
  }

  getAgendaParticipation(votingOrder) {
    const excluded = []
    let order = [...votingOrder]

    for (const player of votingOrder) {
      const handler = this._getPlayerHandler(player)
      if (handler?.isExcludedFromVoting) {
        excluded.push(player.name)
      }
    }

    const firstIdx = order.findIndex(p => {
      const handler = this._getPlayerHandler(p)
      return handler?.votesFirst
    })
    if (firstIdx > 0) {
      const [first] = order.splice(firstIdx, 1)
      order.unshift(first)
    }

    return { order, excluded }
  }

  onAgendaOutcomeResolved(agenda, winningOutcome, playerVotes) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onAgendaOutcomeResolved?.(player, this, { agenda, winningOutcome, playerVotes })
    }
  }

  // Backward-compat: tests call this directly
  _nomadFutureSight(winningOutcome, playerVotes) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onAgendaOutcomeResolved?.(player, this, { agenda: null, winningOutcome, playerVotes })
    }
  }


  // ---------------------------------------------------------------------------
  // L. Wormhole / Movement Abilities
  // ---------------------------------------------------------------------------

  // getHomeSystemWormholes and getMovementBonus are in section A (passive modifiers)


  // ---------------------------------------------------------------------------
  // M. Tech Parasite / Unit Destroyed
  // ---------------------------------------------------------------------------

  onUnitDestroyed(systemId, unit, destroyerName) {
    const destroyer = this.players.byName(destroyerName)
    const handler = this._getPlayerHandler(destroyer)
    handler?.onUnitDestroyed?.(destroyer, this, { systemId, unit })

    // Self Assembly Routines: gain 1 trade good when own mech is destroyed
    if (unit.type === 'mech') {
      const owner = this.players.byName(unit.owner)
      if (owner && owner.hasTechnology('self-assembly-routines')) {
        owner.addTradeGoods(1)
        this.log.add({
          template: 'Self Assembly Routines: {player} gains 1 trade good (mech destroyed)',
          args: { player: unit.owner },
        })
      }
    }
  }


  // ---------------------------------------------------------------------------
  // N. Pre-Movement Triggers / Tactical Action End
  // ---------------------------------------------------------------------------

  onTacticalActionEnd(activatingPlayer, systemId) {
    // All players get a chance to respond (e.g., Sardakk T'ro agent)
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onTacticalActionEnd?.(player, this, { activatingPlayer, systemId })
    }
  }

  onPreMovement(activatingPlayer, systemId) {
    for (const player of this.players.all()) {
      if (player.name === activatingPlayer.name) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      handler?.onPreMovement?.(player, this, { activatingPlayer, systemId })
    }
  }


  // ---------------------------------------------------------------------------
  // O. Post-Combat Triggers
  // ---------------------------------------------------------------------------

  afterCombatResolved(systemId, winnerName, loserName, combatType) {
    const winner = this.players.byName(winnerName)
    const handler = this._getPlayerHandler(winner)
    handler?.afterCombatResolved?.(winner, this, { systemId, loserName, combatType })

    // Faction tech effects that trigger after combat (e.g., N'orr Supremacy)
    if (handler?.onCombatWon && winner) {
      handler.onCombatWon(winner, this, { systemId, loserName, combatType })
    }

    // Reset singularity tracking
    delete this.state._singularityUsedThisCombat
  }


  // ---------------------------------------------------------------------------
  // P. System Activation Triggers
  // ---------------------------------------------------------------------------

  onSystemActivated(playerName, systemId) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    handler?.onSystemActivated?.(player, this, systemId)
  }


  // ---------------------------------------------------------------------------
  // Q. Exploration Triggers
  // ---------------------------------------------------------------------------

  afterExploration(player, planetId, _systemId) {
    const handler = this._getPlayerHandler(player)
    handler?.afterExploration?.(player, this, planetId)
  }


  // ---------------------------------------------------------------------------
  // R. Coalescence Checks
  // ---------------------------------------------------------------------------

  checkCoalescence(systemId, moverName) {
    for (const player of this.players.all()) {
      if (player.name === moverName) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      if (handler?.checkCoalescence?.(player, this, { systemId, moverName })) {
        return true
      }
    }
    return false
  }

  checkCoalescenceOnPlanet(systemId, planetId, moverName) {
    for (const player of this.players.all()) {
      if (player.name === moverName) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      if (handler?.checkCoalescenceOnPlanet?.(player, this, { systemId, planetId, moverName })) {
        return true
      }
    }
    return false
  }


  // ---------------------------------------------------------------------------
  // S. Turn / Phase Start Triggers
  // ---------------------------------------------------------------------------

  onTurnStart(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onTurnStart?.(player, this)
  }

  onStrategyPhaseStart(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStrategyPhaseStart?.(player, this)
  }


  // ---------------------------------------------------------------------------
  // T. Strategy Token Triggers
  // ---------------------------------------------------------------------------

  onStrategyTokenSpent(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStrategyTokenSpent?.(player, this)
  }


  // ---------------------------------------------------------------------------
  // U. Commodity Triggers
  // ---------------------------------------------------------------------------

  onCommoditiesReplenished(_replenishingPlayer) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onCommoditiesReplenished?.(player, this)
    }
  }


  // ---------------------------------------------------------------------------
  // V. Commander Effects Registry
  // ---------------------------------------------------------------------------

  getActiveCommanderEffects(player) {
    const effects = []

    // Own commander
    if (player.isCommanderUnlocked()) {
      const handler = this._getPlayerHandler(player)
      if (handler?.commanderEffect) {
        effects.push({ factionId: player.factionId, ...handler.commanderEffect })
      }
    }

    // Mahact imperia: use captured players' commander abilities
    if (this._hasAbility(player, 'imperia')) {
      const captured = this.state.capturedCommandTokens[player.name] || []
      for (const capturedPlayerName of captured) {
        const capturedPlayer = this.players.byName(capturedPlayerName)
        if (!capturedPlayer) {
          continue
        }
        if (!capturedPlayer.isCommanderUnlocked()) {
          continue
        }

        const capturedHandler = this._getPlayerHandler(capturedPlayer)
        if (capturedHandler?.commanderEffect) {
          effects.push({ factionId: capturedPlayer.factionId, ...capturedHandler.commanderEffect })
        }
      }
    }

    return effects
  }

  getCommanderCombatModifier(player, combatType) {
    const effects = this.getActiveCommanderEffects(player)
    let modifier = 0

    for (const effect of effects) {
      if (effect.timing === 'combat-modifier') {
        modifier += (typeof effect.apply === 'function'
          ? effect.apply(player, { timing: 'combat-modifier', combatType })
          : 0)
      }
      if (effect.timing === 'ground-combat-modifier' && combatType === 'ground') {
        modifier += (typeof effect.apply === 'function'
          ? effect.apply(player, { timing: 'ground-combat-modifier', combatType })
          : 0)
      }
    }

    return modifier
  }
}


module.exports = { FactionAbilities }
