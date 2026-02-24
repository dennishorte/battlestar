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

  getSpaceCombatModifier(player, systemId) {
    const handler = this._getPlayerHandler(player)
    return handler?.getSpaceCombatModifier?.(player, this, systemId) ?? 0
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

  getTechPrerequisiteBonuses(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getTechPrerequisiteBonuses?.(player, this) ?? {}
  }

  getAdditionalResearchableTechs(player, allTechs) {
    const handler = this._getPlayerHandler(player)
    return handler?.getAdditionalResearchableTechs?.(player, this, allTechs) ?? []
  }

  onPreResearch(player, tech) {
    const handler = this._getPlayerHandler(player)
    handler?.onPreResearch?.(player, this, tech)
  }

  onTechResearched(player, tech) {
    const handler = this._getPlayerHandler(player)
    handler?.onTechResearched?.(player, this, tech)

    // Notify all players about technology research (e.g., Jol-Nar agent Doctor Sucaban)
    for (const otherPlayer of this.players.all()) {
      const otherHandler = this._getPlayerHandler(otherPlayer)
      otherHandler?.onAnyTechResearched?.(otherPlayer, this, { researchingPlayer: player, tech })
    }
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

  canBypassHomeSystemCheck(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.canBypassHomeSystemCheck?.(player, this) ?? false
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

  /**
   * Check if a system is blocked for movement by structure-blocking abilities
   * (e.g., Aerie Hololattice). Returns true if the mover cannot pass through.
   */
  isStructureBlocking(systemId, moverName) {
    for (const player of this.players.all()) {
      if (player.name === moverName) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      if (handler?.isStructureBlocking?.(player, this, { systemId, moverName })) {
        return true
      }
    }
    return false
  }

  /**
   * Returns extra PRODUCTION capacity from faction abilities (e.g., Aerie Hololattice).
   * Returns the number of extra production units in this system for this player.
   */
  getStructureProductionBonus(player, systemId) {
    const handler = this._getPlayerHandler(player)
    return handler?.getStructureProductionBonus?.(player, this, systemId) ?? 0
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

  getTradeGoodVoteRate(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getTradeGoodVoteRate?.(player, this) ?? 0
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

  isSpaceCannonImmuneDuringInvasion(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.isSpaceCannonImmuneDuringInvasion?.(player, this) ?? false
  }

  getSustainDamageHitsCancel(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getSustainDamageHitsCancel?.(player, this) ?? 1
  }

  getTradeGoodResourceValue(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getTradeGoodResourceValue?.(player, this) ?? 1
  }

  canSpendFlexibly(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.canSpendFlexibly?.(player, this) ?? false
  }

  getRaidFormationExcessHits(shooterName, totalHits, fightersDestroyed) {
    const player = this.players.byName(shooterName)
    const handler = this._getPlayerHandler(player)
    return handler?.getRaidFormationExcessHits?.(player, this, totalHits, fightersDestroyed) ?? 0
  }

  /**
   * Returns the number of bonus dice that one unit gets when rolling for a unit
   * ability (AFB, space cannon, bombardment).
   * (e.g., Argent Flight Commander Trrakan Aun Zulok grants +1 die to one unit)
   */
  getUnitAbilityBonusDice(shooterName) {
    const player = this.players.byName(shooterName)
    const handler = this._getPlayerHandler(player)
    return handler?.getUnitAbilityBonusDice?.(player, this) ?? 0
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


  /**
   * Check if a unit is immune to the Direct Hit action card.
   * (e.g., L1Z1X Super Dreadnought II)
   */
  isDirectHitImmune(unit) {
    const player = this.players.byName(unit.owner)
    if (!player) {
      return false
    }
    const handler = this._getPlayerHandler(player)
    return handler?.isDirectHitImmune?.(player, this, unit) ?? false
  }

  /**
   * Check if a player's ships can move into supernova systems (as destination).
   * Separate from canMoveThroughSupernovae which allows transit.
   * (e.g., Muaat Magmus Reactor)
   */
  canMoveIntoSupernovae(playerName) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    return handler?.canMoveIntoSupernovae?.(player, this) ?? false
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

  /**
   * Called when hits are about to be assigned to a player's units.
   * Any faction handler may cancel hits (e.g., Titans agent Tellurian).
   * Returns the (possibly reduced) number of hits to assign.
   */
  onHitsProduced(ownerName, systemId, hits, combatType) {
    let remaining = hits
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      if (!handler?.onHitsProduced) {
        continue
      }
      remaining = handler.onHitsProduced(player, this, {
        targetOwner: ownerName,
        systemId,
        hits: remaining,
        combatType,
      })
      if (remaining <= 0) {
        break
      }
    }
    return remaining
  }


  // ---------------------------------------------------------------------------
  // D. Action Card Triggers
  // ---------------------------------------------------------------------------

  onActionCardDraw(player, drawn) {
    const handler = this._getPlayerHandler(player)
    handler?.onActionCardDraw?.(player, this, drawn)
  }

  /**
   * Called when a player plays an action card. Other players may react
   * (e.g., Xxcha Instinct Training can cancel the card).
   * Returns true if the card was cancelled.
   */
  onActionCardPlayed(playingPlayer, card) {
    for (const player of this.players.all()) {
      if (player.name === playingPlayer.name) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      if (handler?.onActionCardPlayed) {
        const cancelled = handler.onActionCardPlayed(player, this, { playingPlayer, card })
        if (cancelled) {
          return true
        }
      }
    }
    return false
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

  onGroundCombatRoundEnd(systemId, planetId, attackerName, defenderName, hitCounts) {
    for (const [self, opponent] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const player = this.players.byName(self)
      const handler = this._getPlayerHandler(player)
      // Determine how many hits the opponent scored against this player
      const opponentHits = self === attackerName
        ? hitCounts?.defenderHits ?? 0
        : hitCounts?.attackerHits ?? 0
      handler?.onGroundCombatRoundEnd?.(player, this, { systemId, planetId, opponentName: opponent, opponentHits })
    }
  }


  // ---------------------------------------------------------------------------
  // H. Planet Gained Triggers
  // ---------------------------------------------------------------------------

  onPlanetGained(playerName, planetId, systemId, structureCounts, previousController) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    handler?.onPlanetGained?.(player, this, { planetId, systemId, structureCounts: structureCounts || {}, previousController: previousController || null })
  }

  onPlanetLost(loserName, planetId, systemId, gainingPlayerName) {
    const player = this.players.byName(loserName)
    const handler = this._getPlayerHandler(player)
    handler?.onPlanetLost?.(player, this, { planetId, systemId, gainingPlayerName })
  }


  // ---------------------------------------------------------------------------
  // I. Status Phase Triggers
  // ---------------------------------------------------------------------------

  onStatusPhaseStart(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStatusPhaseStart?.(player, this)
  }

  onStatusPhaseEnd(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStatusPhaseEnd?.(player, this)
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
      if (handler?.isExcludedFromVoting && !handler?.cannotBeExcludedFromVoting) {
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

  /**
   * Called before each player votes on an agenda. Allows faction abilities
   * (e.g., Mahact Genetic Recombination) to intervene before a vote is cast.
   * Returns { forcedOutcome } if the player must vote a certain way, else null.
   */
  onBeforePlayerVote(votingPlayer, outcomes) {
    for (const player of this.players.all()) {
      if (player.name === votingPlayer.name) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      if (!handler?.onBeforePlayerVote) {
        continue
      }
      const result = handler.onBeforePlayerVote(player, this, { votingPlayer, outcomes })
      if (result) {
        return result
      }
    }
    return null
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

  onUnitDestroyed(systemId, unit, destroyerName, planetId) {
    const destroyer = this.players.byName(destroyerName)
    const handler = this._getPlayerHandler(destroyer)
    handler?.onUnitDestroyed?.(destroyer, this, { systemId, unit, planetId })

    // Notify all players about destruction (e.g., Yin Brotherhood agent — Brother Milor)
    for (const player of this.players.all()) {
      const playerHandler = this._getPlayerHandler(player)
      playerHandler?.onAnyUnitDestroyed?.(player, this, { systemId, unit, planetId, destroyerName })
    }

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

    // Spec Ops II (Sol): after infantry destroyed, roll 1 die; on 5+, save to card for revival
    if (unit.type === 'infantry') {
      const owner = this.players.byName(unit.owner)
      if (owner && owner.hasTechnology('spec-ops-ii')) {
        const roll = Math.floor(this.game.random() * 10) + 1
        if (roll >= 5) {
          if (!this.state.specOpsRevival) {
            this.state.specOpsRevival = {}
          }
          if (!this.state.specOpsRevival[owner.name]) {
            this.state.specOpsRevival[owner.name] = 0
          }
          this.state.specOpsRevival[owner.name]++
          this.log.add({
            template: 'Spec Ops II: {player} infantry survives (rolled {roll})',
            args: { player: owner.name, roll },
          })
        }
        else {
          this.log.add({
            template: 'Spec Ops II: {player} infantry revival failed (rolled {roll})',
            args: { player: owner.name, roll },
          })
        }
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
    // Collect destroyed ship types from combat tracking
    const destroyedTypes = this.state._destroyedDuringCombat || {}

    const winner = this.players.byName(winnerName)
    const handler = this._getPlayerHandler(winner)
    handler?.afterCombatResolved?.(winner, this, { systemId, loserName, combatType })

    // Faction tech effects that trigger after combat (e.g., N'orr Supremacy)
    if (handler?.onCombatWon && winner) {
      handler.onCombatWon(winner, this, { systemId, loserName, combatType })
    }

    // Notify loser about combat result (e.g., Mentak Salvage Operations)
    const loser = this.players.byName(loserName)
    const loserHandler = this._getPlayerHandler(loser)
    if (loserHandler?.onCombatLost && loser) {
      loserHandler.onCombatLost(loser, this, { systemId, winnerName, combatType, destroyedTypes })
    }

    // Salvage Operations: winner gains TG and may produce a destroyed ship type
    if (handler?.onCombatEnd && winner) {
      handler.onCombatEnd(winner, this, {
        systemId, opponentName: loserName, combatType, won: true, destroyedTypes,
      })
    }
    if (loserHandler?.onCombatEnd && loser) {
      loserHandler.onCombatEnd(loser, this, {
        systemId, opponentName: winnerName, combatType, won: false, destroyedTypes,
      })
    }

    // Reset combat tracking
    delete this.state._destroyedDuringCombat
    delete this.state._singularityUsedThisCombat
  }


  // ---------------------------------------------------------------------------
  // P. System Activation Triggers
  // ---------------------------------------------------------------------------

  /**
   * Returns true if the given system cannot be activated by the given player
   * due to a faction ability (e.g., Chaos Mapping blocks asteroid field activation).
   */
  isSystemActivationBlocked(activatingPlayerName, systemId) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      if (handler?.isSystemActivationBlocked?.(player, this, { systemId, activatingPlayerName })) {
        return true
      }
    }
    return false
  }

  onSystemActivated(playerName, systemId) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    handler?.onSystemActivated?.(player, this, systemId)

    // Agent abilities that trigger on any system activation (e.g., Captain Mendosa)
    for (const otherPlayer of this.players.all()) {
      const otherHandler = this._getPlayerHandler(otherPlayer)
      otherHandler?.onAnySystemActivated?.(otherPlayer, this, { systemId, activatingPlayer: player })
    }
  }

  onCommandTokenPlaced(placerName, systemId) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onCommandTokenPlaced?.(player, this, { systemId, placerName })
    }
  }


  // ---------------------------------------------------------------------------
  // Q. Exploration Triggers
  // ---------------------------------------------------------------------------

  afterExploration(player, planetId, _systemId) {
    const handler = this._getPlayerHandler(player)
    handler?.afterExploration?.(player, this, planetId)
  }


  // ---------------------------------------------------------------------------
  // Q1b. Relic Triggers
  // ---------------------------------------------------------------------------

  onRelicGained(gainingPlayerName) {
    const gainingPlayer = this.players.byName(gainingPlayerName)
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onRelicGained?.(player, this, { gainingPlayer })
    }
  }


  // ---------------------------------------------------------------------------
  // Q2. Production Triggers
  // ---------------------------------------------------------------------------

  /**
   * Returns a cost override for a specific unit type during production.
   * If a faction handler returns a number, that overrides the normal cost.
   * Returns null if no override applies.
   */
  getProductionCostOverride(player, unitType) {
    const handler = this._getPlayerHandler(player)
    if (handler?.getProductionCostOverride) {
      return handler.getProductionCostOverride(player, this, unitType)
    }
    return null
  }

  /**
   * Returns how many fighters/infantry produced do NOT count against PRODUCTION limit.
   * Default is 0 (all count).
   */
  getProductionLimitBonus(player, unitType) {
    const handler = this._getPlayerHandler(player)
    if (handler?.getProductionLimitBonus) {
      return handler.getProductionLimitBonus(player, this, unitType)
    }
    return 0
  }

  afterProduction(player, systemId, unitCount, producedUnits) {
    const handler = this._getPlayerHandler(player)
    handler?.afterProduction?.(player, this, { systemId, unitCount, producedUnits: producedUnits || [] })
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
    // Notify the active player's handler
    const handler = this._getPlayerHandler(player)
    handler?.onTurnStart?.(player, this)

    // Notify all other players about any player's turn start
    // (e.g., Nomad Thunder's Paradox triggers at start of any player's turn)
    for (const otherPlayer of this.players.all()) {
      if (otherPlayer.name === player.name) {
        continue
      }
      const otherHandler = this._getPlayerHandler(otherPlayer)
      otherHandler?.onAnyTurnStart?.(otherPlayer, this, { activePlayer: player })
    }
  }

  onStrategyPhaseStart(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStrategyPhaseStart?.(player, this)
  }

  onStrategyPhaseEnd(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStrategyPhaseEnd?.(player, this)
  }


  // ---------------------------------------------------------------------------
  // T. Strategy Token Triggers
  // ---------------------------------------------------------------------------

  onStrategyTokenSpent(spendingPlayer, activePlayerName) {
    // Notify all players (e.g., Mahact agent triggers on own token spend)
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onStrategyTokenSpent?.(player, this, { spendingPlayer, activePlayerName })
    }
  }


  // ---------------------------------------------------------------------------
  // U1. Agent Exhaustion Triggers
  // ---------------------------------------------------------------------------

  onAnyAgentExhausted(exhaustedPlayer, agentId) {
    // Notify all players when any agent is exhausted
    // (e.g., Nomad Temporal Command Suite)
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onAnyAgentExhausted?.(player, this, { exhaustedPlayer, agentId })
    }
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


  // ---------------------------------------------------------------------------
  // W. Public Objective Triggers
  // ---------------------------------------------------------------------------

  onPublicObjectiveScored(scoringPlayer) {
    const handler = this._getPlayerHandler(scoringPlayer)
    handler?.onPublicObjectiveScored?.(scoringPlayer, this)
  }


  // ---------------------------------------------------------------------------
  // X. Ship Movement Triggers
  // ---------------------------------------------------------------------------

  afterShipsMove(playerName, systemId, movedShips) {
    const player = this.players.byName(playerName)
    const handler = this._getPlayerHandler(player)
    handler?.afterShipsMove?.(player, this, { systemId, movedShips })
  }


  // ---------------------------------------------------------------------------
  // Y. Invasion Influence Cost
  // ---------------------------------------------------------------------------

  /**
   * Returns the extra influence cost an invading player must spend to commit
   * ground forces to a planet (e.g., Keleres mech Omniopiares).
   */
  getInvasionInfluenceCost(planetId, systemId, invadingPlayerName) {
    let totalCost = 0
    for (const player of this.players.all()) {
      if (player.name === invadingPlayerName) {
        continue
      }
      const handler = this._getPlayerHandler(player)
      if (handler?.getInvasionInfluenceCost) {
        totalCost += handler.getInvasionInfluenceCost(player, this, {
          planetId,
          systemId,
          invadingPlayer: invadingPlayerName,
        })
      }
    }
    return totalCost
  }
}


module.exports = { FactionAbilities }
