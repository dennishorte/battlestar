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
  // Agent Favor System — pull-mode agent abilities
  // ---------------------------------------------------------------------------

  /**
   * Collect and offer available agent favors at a given timing point.
   *
   * Faction handlers export an `agentFavors` array. Each entry declares:
   *   - timing: when it fires (e.g., 'on-system-activated')
   *   - isAvailable(agentOwner, ctx, hookArgs): returns { description, context } or null
   *   - execute(agentOwner, beneficiary, ctx, hookArgs, context): performs the effect
   *
   * Self-use (beneficiary owns the agent): direct prompt, no negotiation.
   * Request (beneficiary asks another player): owner can accept or decline.
   */
  _offerFavors(timing, beneficiary, hookArgs) {
    const availableFavors = []

    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      if (!handler?.agentFavors) {
        continue
      }

      for (const favor of handler.agentFavors) {
        if (favor.timing !== timing) {
          continue
        }

        const result = favor.isAvailable(player, this, hookArgs)
        if (!result) {
          continue
        }

        availableFavors.push({
          favor,
          agentOwner: player,
          description: result.description,
          context: result.context,
        })
      }
    }

    if (availableFavors.length === 0) {
      return
    }

    // Self-use favors: direct prompt (no negotiation needed)
    const selfFavors = availableFavors.filter(f => f.agentOwner.name === beneficiary.name)
    for (const { favor, agentOwner, context } of selfFavors) {
      const choice = this.actions.choose(beneficiary, [`Exhaust ${favor.name}`, 'Pass'], {
        title: `${favor.name}: ${context.description || ''}`,
      })
      if (choice[0] === `Exhaust ${favor.name}`) {
        favor.execute(agentOwner, beneficiary, this, hookArgs, context)
      }
    }

    // Requestable favors from other players
    const otherFavors = availableFavors.filter(f => f.agentOwner.name !== beneficiary.name)
    if (otherFavors.length > 0) {
      const choices = otherFavors.map(({ favor, agentOwner }) =>
        `Request ${favor.name} from ${agentOwner.name}`
      )
      choices.push('Skip Favors')

      const selection = this.actions.choose(beneficiary, choices, {
        title: 'Request an agent favor?',
      })

      if (selection[0] !== 'Skip Favors') {
        const selectedIndex = choices.indexOf(selection[0])
        const selected = otherFavors[selectedIndex]

        const response = this.actions.choose(selected.agentOwner, ['Accept', 'Decline'], {
          title: `${beneficiary.name} requests ${selected.favor.name}: ${selected.description}`,
        })

        if (response[0] === 'Accept') {
          selected.favor.execute(selected.agentOwner, beneficiary, this, hookArgs, selected.context)
        }
      }
    }
  }


  // ---------------------------------------------------------------------------
  // A. Passive Modifiers — pure value queries, no mutation
  // ---------------------------------------------------------------------------

  getCombatModifier(player) {
    const handler = this._getPlayerHandler(player)
    let modifier = handler?.getCombatModifier?.(player, this) ?? 0

    // Promissory note combat modifiers
    if (this.state._tekklarLegionActive?.[player.name]) {
      modifier -= 1  // +1 combat bonus for holder
    }
    if (this.state._tekklarLegionPenalty?.[player.name]) {
      modifier += 1  // -1 combat penalty for Sardakk opponent
    }

    return modifier
  }

  getSpaceCombatModifier(player, systemId) {
    const handler = this._getPlayerHandler(player)
    return handler?.getSpaceCombatModifier?.(player, this, systemId) ?? 0
  }

  getStatusPhaseTokenBonus(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.getStatusPhaseTokenBonus?.(player, this) ?? 0
  }

  isNeighborOverride(playerAName, playerBName) {
    // Check both directions — either player might have a neighbor override
    const playerA = this.players.byName(playerAName)
    const playerB = this.players.byName(playerBName)
    if (!playerA || !playerB) {
      return false
    }

    const handlerA = this._getPlayerHandler(playerA)
    if (handlerA?.isNeighborOverride?.(playerA, this, playerB)) {
      return true
    }

    const handlerB = this._getPlayerHandler(playerB)
    if (handlerB?.isNeighborOverride?.(playerB, this, playerA)) {
      return true
    }

    return false
  }

  canTradeWithNonNeighbors(player) {
    const handler = this._getPlayerHandler(player)
    if (handler?.canTradeWithNonNeighbors?.(player, this)) {
      return true
    }
    // Trade Convoys: activated PN grants non-neighbor trading
    if ((this.state._activatedPNs || []).some(p => p.id === 'trade-convoys' && p.holder === player.name)) {
      return true
    }
    return false
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

    // Research Agreement: when Jol-Nar researches a non-faction tech,
    // the holder gains that technology and returns the card
    this._checkResearchAgreement(player, tech)
  }

  canTradeActionCards(player, target) {
    return !!(this._getPlayerHandler(player)?.canTradeActionCards?.(player, this, target) ||
              this._getPlayerHandler(target)?.canTradeActionCards?.(target, this, player))
  }

  canSkipTradeSecondaryCost(player) {
    const handler = this._getPlayerHandler(player)
    return handler?.canSkipTradeSecondaryCost?.(player, this) ?? false
  }

  hasAcquiescence(player, activePlayer) {
    // Acquiescence: holder gets free secondary when the Winnu player uses strategic action
    if (activePlayer.faction?.id !== 'winnu') {
      return false
    }
    const pn = player.getPromissoryNotes().find(n => n.id === 'acquiescence' && n.owner !== player.name)
    return !!pn
  }

  returnAcquiescence(player, activePlayer) {
    if (activePlayer.faction?.id !== 'winnu') {
      return
    }
    const pn = player.getPromissoryNotes().find(n => n.id === 'acquiescence' && n.owner !== player.name)
    if (!pn) {
      return
    }
    player.removePromissoryNote('acquiescence', pn.owner)
    const owner = this.players.byName(pn.owner)
    if (owner) {
      owner.addPromissoryNote('acquiescence', pn.owner)
    }
    this.log.add({
      template: 'Acquiescence returned from {holder} to {owner}',
      args: { holder: player.name, owner: pn.owner },
    })
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
   * Also offers Strike Wing Ambuscade promissory note if held.
   */
  getUnitAbilityBonusDice(shooterName) {
    const player = this.players.byName(shooterName)
    const handler = this._getPlayerHandler(player)
    let bonus = handler?.getUnitAbilityBonusDice?.(player, this) ?? 0

    // Strike Wing Ambuscade (Argent Flight PN)
    // "When 1 or more of your units make a roll for a unit ability:
    //  Choose 1 of those units to roll 1 additional die.
    //  Then, return this card to the Argent player."
    if (!this.state._ambuscadeUsed) {
      const pn = player?.getPromissoryNotes().find(
        n => n.id === 'strike-wing-ambuscade' && n.owner !== player.name
      )
      if (pn) {
        const choice = this.actions.choose(player, ['Play Strike Wing Ambuscade', 'Pass'], {
          title: 'Strike Wing Ambuscade: One unit rolls 1 additional die?',
        })
        if (choice[0] === 'Play Strike Wing Ambuscade') {
          bonus += 1
          this.state._ambuscadeUsed = true

          // Return PN to Argent
          const argentPlayer = this.players.byName(pn.owner)
          player.removePromissoryNote('strike-wing-ambuscade', pn.owner)
          if (argentPlayer) {
            argentPlayer.addPromissoryNote('strike-wing-ambuscade', pn.owner)
          }

          this.log.add({
            template: 'Strike Wing Ambuscade: {player} rolls 1 additional die. Card returned to {owner}.',
            args: { player: shooterName, owner: pn.owner },
          })
        }
      }
    }

    return bonus
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


  /**
   * Check if a player's mechs are immune to bombardment/space cannon hits.
   * (e.g., Xxcha Indomitus — cannot be destroyed by bombardment)
   */
  isMechImmuneToAbilityHits(ownerName) {
    const player = this.players.byName(ownerName)
    const handler = this._getPlayerHandler(player)
    return handler?.isMechImmuneToAbilityHits ?? false
  }

  /**
   * Check if ground sustain damage is blocked on a planet.
   * (e.g., Mentak Moll Terminus — opponent ground forces cannot use sustain damage)
   */
  isGroundSustainBlocked(ownerName, systemId, planetId) {
    const planetUnits = this.state.units[systemId]?.planets[planetId] || []
    // Check if any opponent has a mech on this planet that blocks sustain
    for (const unit of planetUnits) {
      if (unit.owner === ownerName || unit.type !== 'mech') {
        continue
      }
      const handler = this._getPlayerHandler(this.players.byName(unit.owner))
      if (handler?.mechBlocksOpponentSustain) {
        return true
      }
    }
    return false
  }

  /**
   * Returns per-unit ground combat modifier for a specific unit.
   * (e.g., Shield Paling negates Fragile +1 for infantry on same planet as mech)
   */
  getGroundCombatUnitModifier(player, unit, systemId, planetId) {
    const handler = this._getPlayerHandler(player)
    return handler?.getGroundCombatUnitModifier?.(player, this, unit, systemId, planetId) ?? 0
  }


  // ---------------------------------------------------------------------------
  // B. Component Actions — data-driven registry
  // ---------------------------------------------------------------------------

  getAvailableComponentActions(player) {
    const actions = []

    // Faction-specific component actions
    const handler = this._getPlayerHandler(player)
    if (handler?.componentActions) {
      actions.push(
        ...handler.componentActions
          .filter(h => this._hasAbility(player, h.abilityId) && h.isAvailable.call({ _game: this.game }, player))
          .map(h => ({ id: h.id, name: h.name }))
      )
    }

    // Deepgloom Executable: Yssaril player may share Stall Tactics with other factions
    if (player.faction?.id !== 'yssaril-tribes') {
      const yssarilPlayer = this.players.all().find(p =>
        p.faction?.id === 'yssaril-tribes' && p.hasTechnology('deepgloom-executable')
      )
      if (yssarilPlayer && (player.actionCards || []).length > 0) {
        actions.push({ id: 'stall-tactics-deepgloom', name: 'Stall Tactics (Deepgloom)' })
      }
    }

    // Activatable promissory notes (ACTION type)
    actions.push(...this._getActivatablePNs(player))

    return actions
  }

  _getActivatablePNs(player) {
    const pnActions = []
    const notes = player.getPromissoryNotes()
    for (const pn of notes) {
      if (pn.owner === player.name) {
        continue
      }

      const activatableNames = {
        'promise-of-protection': 'Promise of Protection',
        'dark-pact': 'Dark Pact',
        'blood-pact': 'Blood Pact',
        'trade-convoys': 'Trade Convoys',
        'fires-of-the-gashlai': 'Fires of the Gashlai',
        'research-agreement': 'Research Agreement',
        'black-market-forgery': 'Black Market Forgery',
        'terraform': 'Terraform',
        'crucible': 'Crucible',
      }
      if (activatableNames[pn.id]) {
        // Black Market Forgery: only available if holder has 2 fragments of same type
        if (pn.id === 'black-market-forgery') {
          const counts = {}
          for (const f of (player.relicFragments || [])) {
            counts[f] = (counts[f] || 0) + 1
          }
          if (!Object.values(counts).some(c => c >= 2)) {
            continue
          }
        }
        const alreadyActive = (this.state._activatedPNs || [])
          .some(p => p.id === pn.id && p.holder === player.name)
        if (!alreadyActive) {
          pnActions.push({ id: pn.id, name: activatableNames[pn.id] })
        }
      }
    }
    return pnActions
  }

  executeComponentAction(player, actionId) {
    // Check if it's a PN activation
    if (this._executePromissoryNoteAction(player, actionId)) {
      return
    }

    // Deepgloom Executable: shared Stall Tactics
    if (actionId === 'stall-tactics-deepgloom') {
      this._executeDeepgloomStallTactics(player)
      return
    }

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

  _executeDeepgloomStallTactics(player) {
    const yssarilPlayer = this.players.all().find(p =>
      p.faction?.id === 'yssaril-tribes' && p.hasTechnology('deepgloom-executable')
    )
    if (!yssarilPlayer) {
      return
    }

    // Yssaril must approve
    const approval = this.actions.choose(yssarilPlayer, ['Allow', 'Deny'], {
      title: `Deepgloom Executable: Allow ${player.name} to use Stall Tactics?`,
    })

    if (approval[0] !== 'Allow') {
      return
    }

    // Execute Stall Tactics for the requesting player
    const { getHandler } = require('./factions/index.js')
    const yssarilHandler = getHandler('yssaril-tribes')
    yssarilHandler.stallTactics(this, player)

    this.log.add({
      template: 'Deepgloom Executable: {yssaril} allows {player} to use Stall Tactics',
      args: { yssaril: yssarilPlayer.name, player: player.name },
    })

    // Offer optional transaction between Yssaril and the player
    const transact = this.actions.choose(yssarilPlayer, ['Transact', 'Pass'], {
      title: `Deepgloom Executable: Transact with ${player.name}?`,
    })
    if (transact[0] === 'Transact') {
      this.game._resolveTransaction(yssarilPlayer, player.name)
    }
  }

  _executePromissoryNoteAction(player, actionId) {
    const factionMap = {
      'promise-of-protection': 'mentak-coalition',
      'dark-pact': 'empyrean',
      'blood-pact': 'empyrean',
      'trade-convoys': 'emirates-of-hacan',
      'fires-of-the-gashlai': 'embers-of-muaat',
      'research-agreement': 'universities-of-jol-nar',
      'black-market-forgery': 'naaz-rokha-alliance',
      'terraform': 'titans-of-ul',
      'crucible': 'vuil-raith-cabal',
    }
    const nameMap = {
      'promise-of-protection': 'Promise of Protection',
      'dark-pact': 'Dark Pact',
      'blood-pact': 'Blood Pact',
      'trade-convoys': 'Trade Convoys',
      'fires-of-the-gashlai': 'Fires of the Gashlai',
      'research-agreement': 'Research Agreement',
      'black-market-forgery': 'Black Market Forgery',
      'terraform': 'Terraform',
      'crucible': 'Crucible',
    }
    if (!factionMap[actionId]) {
      return false
    }

    const pn = player.getPromissoryNotes().find(n => n.id === actionId && n.owner !== player.name)
    if (!pn) {
      return false
    }

    this.log.add({
      template: '{player} plays {pnName}',
      args: { player: player.name, pnName: nameMap[actionId] },
    })

    // One-shot PNs: resolve effect immediately and return to owner
    if (actionId === 'fires-of-the-gashlai') {
      this._resolveFiresOfTheGashlai(player, pn)
      return true
    }
    if (actionId === 'black-market-forgery') {
      this._resolveBlackMarketForgery(player, pn)
      return true
    }
    if (actionId === 'terraform') {
      this._resolveTerraform(player, pn)
      return true
    }
    if (actionId === 'crucible') {
      this._resolveCrucible(player, pn)
      return true
    }

    // Face-up PNs: add to activated list for passive effects
    if (!this.state._activatedPNs) {
      this.state._activatedPNs = []
    }
    this.state._activatedPNs.push({
      id: actionId,
      holder: player.name,
      owner: pn.owner,
      faction: factionMap[actionId],
    })
    return true
  }

  _resolveFiresOfTheGashlai(player, pn) {
    // Remove 1 fleet token from Muaat player
    const muaat = this.players.byName(pn.owner)
    if (muaat && muaat.commandTokens.fleet > 0) {
      muaat.commandTokens.fleet -= 1
      this.log.add({
        template: '{muaat} loses 1 fleet token',
        args: { muaat: pn.owner },
      })
    }

    // Grant holder War Sun unit upgrade technology
    this.game._grantTechnology(player, 'war-sun')
    this.log.add({
      template: '{player} gains War Sun unit upgrade technology',
      args: { player: player.name },
    })

    // Return PN to Muaat
    player.removePromissoryNote(pn.id, pn.owner)
    if (muaat) {
      muaat.addPromissoryNote(pn.id, pn.owner)
    }
    this.log.add({
      template: '{pnName} returned from {holder} to {owner}',
      args: { pnName: 'Fires of the Gashlai', holder: player.name, owner: pn.owner },
    })
  }

  _resolveBlackMarketForgery(player, pn) {
    const fragments = player.relicFragments || []
    const counts = {}
    for (const f of fragments) {
      counts[f] = (counts[f] || 0) + 1
    }
    const pairTypes = Object.entries(counts).filter(([, c]) => c >= 2).map(([t]) => t)
    if (pairTypes.length === 0) {
      return
    }

    let fragType
    if (pairTypes.length === 1) {
      fragType = pairTypes[0]
    }
    else {
      const fragSelection = this.actions.choose(player, pairTypes, {
        title: 'Choose fragment type to purge (2)',
      })
      fragType = fragSelection[0]
    }

    // Purge 2 fragments
    for (let i = 0; i < 2; i++) {
      const idx = player.relicFragments.indexOf(fragType)
      if (idx !== -1) {
        player.relicFragments.splice(idx, 1)
      }
    }

    this.log.add({
      template: '{player} purges 2 {type} fragments for a relic (Black Market Forgery)',
      args: { player: player.name, type: fragType },
    })

    // Return PN to Naaz-Rokha
    const owner = this.players.byName(pn.owner)
    player.removePromissoryNote(pn.id, pn.owner)
    if (owner) {
      owner.addPromissoryNote(pn.id, pn.owner)
    }
    this.log.add({
      template: '{pnName} returned from {holder} to {owner}',
      args: { pnName: 'Black Market Forgery', holder: player.name, owner: pn.owner },
    })
  }

  _resolveTerraform(player, pn) {
    // Choose a non-home planet the holder controls (not Mecatol Rex)
    const controlledPlanets = Object.entries(this.state.planets)
      .filter(([, s]) => s.controller === player.name)
      .map(([id]) => id)
    const res = require('../res')
    const eligible = controlledPlanets.filter(pId => {
      const planet = res.getPlanet(pId)
      if (!planet) {
        return false
      }
      if (pId === 'mecatol-rex') {
        return false
      }
      // Non-home: exclude planets in any faction's home system
      const sysId = String(planet.systemId || '')
      if (sysId.endsWith('-home')) {
        return false
      }
      return true
    })

    if (eligible.length === 0) {
      return
    }

    let planetId
    if (eligible.length === 1) {
      planetId = eligible[0]
    }
    else {
      const selection = this.actions.choose(player, eligible, {
        title: 'Terraform: Attach to a non-home planet',
      })
      planetId = selection[0]
    }

    // Attach permanently — no return to Titans
    this.state.planets[planetId].terraform = true
    player.removePromissoryNote(pn.id, pn.owner)

    this.log.add({
      template: '{player} attaches Terraform to {planet} (+1 resource, +1 influence, all traits)',
      args: { player: player.name, planet: planetId },
    })
  }

  _resolveCrucible(player, pn) {
    // Set gravity rift immunity flag for the holder's next movement
    this.state._crucibleActive = player.name

    this.log.add({
      template: '{player} plays Crucible: ships ignore gravity rifts and gain +1 move through them',
      args: { player: player.name },
    })

    // Return to Vuil'raith player immediately
    player.removePromissoryNote(pn.id, pn.owner)
    const owner = this.players.byName(pn.owner)
    if (owner) {
      owner.addPromissoryNote(pn.id, pn.owner)
    }

    this.log.add({
      template: 'Crucible returned to {owner}',
      args: { owner: pn.owner },
    })
  }

  _checkResearchAgreement(researchingPlayer, tech) {
    if (!this.state._activatedPNs?.length) {
      return
    }
    // Only triggers for non-faction technologies
    if (tech.faction) {
      return
    }
    // Only triggers when the Jol-Nar player researches
    if (researchingPlayer.faction?.id !== 'universities-of-jol-nar') {
      return
    }

    for (let i = this.state._activatedPNs.length - 1; i >= 0; i--) {
      const pn = this.state._activatedPNs[i]
      if (pn.id !== 'research-agreement') {
        continue
      }

      const holder = this.players.byName(pn.holder)
      if (!holder) {
        continue
      }
      // Don't grant if holder already has this tech
      if (holder.hasTechnology(tech.id)) {
        continue
      }

      // Grant the same technology to the holder
      this.game._grantTechnology(holder, tech.id)
      this.log.add({
        template: 'Research Agreement: {holder} gains {tech}',
        args: { holder: pn.holder, tech: tech.name },
      })

      // Remove from activated and return to Jol-Nar
      this.state._activatedPNs.splice(i, 1)
      holder.removePromissoryNote(pn.id, pn.owner)
      const owner = this.players.byName(pn.owner)
      if (owner) {
        owner.addPromissoryNote(pn.id, pn.owner)
      }
      this.log.add({
        template: '{pnName} returned from {holder} to {owner}',
        args: { pnName: 'Research Agreement', holder: pn.holder, owner: pn.owner },
      })
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

    // Offer combat-start promissory notes (Antivirus)
    this._offerCombatStartPromissoryNotes(systemId, attacker, defender)
  }

  _offerCombatStartPromissoryNotes(systemId, attackerName, defenderName) {
    for (const [participantName, opponentName] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const participant = this.players.byName(participantName)
      if (!participant) {
        continue
      }

      // Antivirus: prevent Nekro Technological Singularity
      const antivirusPn = participant.getPromissoryNotes().find(n => n.id === 'antivirus' && n.owner !== participant.name)
      if (!antivirusPn) {
        continue
      }

      // Only relevant when fighting against the Nekro player (PN owner)
      if (opponentName !== antivirusPn.owner) {
        continue
      }

      // Check not already active
      const alreadyActive = (this.state._activatedPNs || [])
        .some(p => p.id === 'antivirus' && p.holder === participant.name)
      if (alreadyActive) {
        continue
      }

      const choice = this.actions.choose(participant, ['Play Antivirus', 'Pass'], {
        title: 'Antivirus: Prevent Nekro from using Technological Singularity?',
      })
      if (choice[0] !== 'Play Antivirus') {
        continue
      }

      if (!this.state._activatedPNs) {
        this.state._activatedPNs = []
      }
      this.state._activatedPNs.push({
        id: 'antivirus',
        holder: participant.name,
        owner: antivirusPn.owner,
        faction: 'nekro-virus',
      })

      this.log.add({
        template: '{player} plays Antivirus (Nekro cannot use Technological Singularity)',
        args: { player: participant.name },
      })
    }

    // War Funding (Barony of Letnev PN)
    // "At the start of a round of space combat: The Letnev player loses 2 trade goods.
    //  During this combat round, re-roll any number of your dice.
    //  Then, return this card to the Letnev player."
    for (const [holderName] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const holder = this.players.byName(holderName)
      if (!holder) {
        continue
      }
      const warFundingPn = holder.getPromissoryNotes().find(n => n.id === 'war-funding' && n.owner !== holder.name)
      if (!warFundingPn) {
        continue
      }

      // Check that Letnev has 2 TG
      const letnevPlayer = this.players.byName(warFundingPn.owner)
      if (!letnevPlayer || letnevPlayer.tradeGoods < 2) {
        continue
      }

      const choice = this.actions.choose(holder, ['Play War Funding', 'Pass'], {
        title: 'War Funding: Letnev loses 2 TG for you to reroll dice?',
      })
      if (choice[0] !== 'Play War Funding') {
        continue
      }

      // Letnev loses 2 TG
      letnevPlayer.spendTradeGoods(2)

      // Mark holder for reroll this combat (similar to Munitions Reserves)
      if (!this.state._warFundingActive) {
        this.state._warFundingActive = {}
      }
      this.state._warFundingActive[holderName] = true

      // Return PN to Letnev
      holder.removePromissoryNote('war-funding', warFundingPn.owner)
      letnevPlayer.addPromissoryNote('war-funding', warFundingPn.owner)

      this.log.add({
        template: 'War Funding: {owner} loses 2 trade goods, {player} may reroll dice. Card returned.',
        args: { player: holderName, owner: warFundingPn.owner },
      })
    }

    // The Cavalry (Nomad PN)
    // "At the start of a space combat against a player other than the Nomad:
    //  During this combat, treat 1 of your non-fighter ships as if it has the
    //  SUSTAIN DAMAGE ability, combat value, and ANTI-FIGHTER BARRAGE value of
    //  the Nomad's flagship. Return this card to the Nomad player at the end
    //  of this combat."
    for (const [holderName] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const holder = this.players.byName(holderName)
      if (!holder?.hasPromissoryNote('the-cavalry')) {
        continue
      }
      const pn = holder.getPromissoryNotes().find(n => n.id === 'the-cavalry' && n.owner !== holder.name)
      if (!pn) {
        continue
      }

      // Only usable when fighting someone other than the Nomad
      const opponentName = holderName === attackerName ? defenderName : attackerName
      if (opponentName === pn.owner) {
        continue
      }

      // Get holder's non-fighter ships in this system
      const systemUnits = this.state.units[systemId]
      const nonFighterShips = (systemUnits?.space || [])
        .filter(u => u.owner === holderName && u.type !== 'fighter')
      if (nonFighterShips.length === 0) {
        continue
      }

      const choice = this.actions.choose(holder, ['Play The Cavalry', 'Pass'], {
        title: 'The Cavalry: Treat one of your ships as having Nomad flagship stats?',
      })
      if (choice[0] !== 'Play The Cavalry') {
        continue
      }

      // Choose which ship to upgrade
      let targetShip
      if (nonFighterShips.length === 1) {
        targetShip = nonFighterShips[0]
      }
      else {
        const shipChoices = nonFighterShips.map(s => s.type)
        const sel = this.actions.choose(holder, shipChoices, {
          title: 'Choose ship to treat as Nomad flagship:',
        })
        targetShip = nonFighterShips[shipChoices.indexOf(sel[0])]
      }

      // Get Nomad's current flagship stats (base or upgraded)
      const nomadPlayer = this.players.byName(pn.owner)
      const flagshipStats = this.game._getUnitStats(pn.owner, 'flagship')

      this.state._cavalryActive = {
        holderName,
        unitId: targetShip.id,
        combat: flagshipStats?.combat || 7,
        abilities: flagshipStats?.abilities || ['sustain-damage', 'anti-fighter-barrage-8x3'],
        nomadOwner: pn.owner,
      }

      // Return PN to Nomad at end of combat (tracked in afterCombatResolved)
      holder.removePromissoryNote('the-cavalry', pn.owner)
      if (nomadPlayer) {
        nomadPlayer.addPromissoryNote('the-cavalry', pn.owner)
      }

      this.log.add({
        template: 'The Cavalry: {player} treats {shipType} as Nomad flagship. Card returned to {owner}.',
        args: { player: holderName, shipType: targetShip.type, owner: pn.owner },
      })
      break
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

  onUnitsSustainedDamage(ownerName, systemId, count, planetId, sustainedUnitIds) {
    const player = this.players.byName(ownerName)
    const handler = this._getPlayerHandler(player)
    handler?.onUnitsSustainedDamage?.(player, this, { systemId, count, planetId, sustainedUnitIds })
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

    // Deepgloom Executable: Yssaril may share Scheming with non-Yssaril players
    if (player.faction?.id !== 'yssaril-tribes' && drawn.length > 0) {
      const yssarilPlayer = this.players.all().find(p =>
        p.faction?.id === 'yssaril-tribes' && p.hasTechnology('deepgloom-executable')
      )
      if (yssarilPlayer) {
        const approval = this.actions.choose(yssarilPlayer, ['Share Scheming', 'Pass'], {
          title: `Deepgloom Executable: Share Scheming with ${player.name}?`,
        })
        if (approval[0] === 'Share Scheming') {
          const { getHandler } = require('./factions/index.js')
          const yssarilHandler = getHandler('yssaril-tribes')
          yssarilHandler.onActionCardDraw(player, this, drawn)

          this.log.add({
            template: 'Deepgloom Executable: {yssaril} shares Scheming with {player}',
            args: { yssaril: yssarilPlayer.name, player: player.name },
          })

          // Offer optional transaction
          const transact = this.actions.choose(yssarilPlayer, ['Transact', 'Pass'], {
            title: `Deepgloom Executable: Transact with ${player.name}?`,
          })
          if (transact[0] === 'Transact') {
            this.game._resolveTransaction(yssarilPlayer, player.name)
          }
        }
      }
    }
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

    // Promissory note checks on ship movement
    this._offerShipMovementPromissoryNotes(systemId, moverName)
  }

  _offerShipMovementPromissoryNotes(systemId, moverName) {
    // Stymie (Arborec PN)
    // "After another player moves ships into a system that contains 1 or more of your units:
    //  You may place 1 command token from that player's reinforcements in any non-home system.
    //  Then, return this card to the Arborec player."
    for (const holder of this.players.all()) {
      if (holder.name === moverName) {
        continue
      }
      if (!holder.hasPromissoryNote('stymie')) {
        continue
      }

      const pn = holder.getPromissoryNotes().find(n => n.id === 'stymie')
      if (!pn || pn.owner === holder.name) {
        continue
      }

      // Check if holder has units in the system
      const systemUnits = this.state.units[systemId]
      if (!systemUnits) {
        continue
      }
      const holderUnitsInSpace = systemUnits.space.filter(u => u.owner === holder.name)
      const holderUnitsOnPlanets = Object.values(systemUnits.planets || {})
        .flat()
        .filter(u => u.owner === holder.name)
      if (holderUnitsInSpace.length === 0 && holderUnitsOnPlanets.length === 0) {
        continue
      }

      const choice = this.actions.choose(holder, ['Play Stymie', 'Pass'], {
        title: `Stymie: Place ${moverName}'s command token in a non-home system?`,
      })

      if (choice[0] !== 'Play Stymie') {
        continue
      }

      // Choose non-home system for the command token
      const res = require('../res/index.js')
      const nonHomeSystems = Object.keys(this.state.systems).filter(sId => {
        const tile = res.getSystemTile(sId) || res.getSystemTile(Number(sId))
        return tile && tile.type !== 'home'
      })

      if (nonHomeSystems.length > 0) {
        const sel = this.actions.choose(holder, nonHomeSystems, {
          title: 'Stymie: Choose system for command token',
        })
        const targetSystem = sel[0]
        if (this.state.systems[targetSystem]) {
          this.state.systems[targetSystem].commandTokens.push({ playerName: moverName })
        }
      }

      // Return PN
      holder.removePromissoryNote('stymie', pn.owner)
      const ownerPlayer = this.players.byName(pn.owner)
      if (ownerPlayer) {
        ownerPlayer.addPromissoryNote('stymie', pn.owner)
      }

      this.log.add({
        template: "Stymie: {player} places {mover}'s command token, returns card to {owner}",
        args: { player: holder.name, mover: moverName, owner: pn.owner },
      })
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

  onCommodityExchanged(giverName, receiverName, commodityCount) {
    if (commodityCount <= 0) {
      return
    }

    // Dark Pact: when holder gives commodities >= their max commodity value to Empyrean, both gain 1 TG
    for (const pn of (this.state._activatedPNs || [])) {
      if (pn.id !== 'dark-pact') {
        continue
      }
      if (pn.holder !== giverName) {
        continue
      }
      if (pn.owner !== receiverName) {
        continue
      }

      const holder = this.players.byName(pn.holder)
      if (!holder) {
        continue
      }
      if (commodityCount < holder.maxCommodities) {
        continue
      }

      const empyrean = this.players.byName(pn.owner)
      holder.addTradeGoods(1)
      if (empyrean) {
        empyrean.addTradeGoods(1)
      }

      this.log.add({
        template: 'Dark Pact: {holder} and {empyrean} each gain 1 trade good',
        args: { holder: pn.holder, empyrean: pn.owner },
      })
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

    // Promissory note checks at start of ground combat
    this._offerGroundCombatPromissoryNotes(systemId, planetId, attackerName, defenderName)
  }

  _offerGroundCombatPromissoryNotes(systemId, planetId, attackerName, defenderName) {
    for (const [holderName, opponentName] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const holder = this.players.byName(holderName)

      // Tekklar Legion (Sardakk N'orr PN)
      // "Apply +1 to the result of each of your unit's combat rolls during this combat.
      //  If your opponent is the N'orr player, apply -1 to their rolls. Then, return this card."
      if (holder.hasPromissoryNote('tekklar-legion')) {
        const pn = holder.getPromissoryNotes().find(n => n.id === 'tekklar-legion')
        if (pn && pn.owner !== holderName) {
          const choice = this.actions.choose(holder, ['Play Tekklar Legion', 'Pass'], {
            title: 'Tekklar Legion: Return for +1 combat this invasion?',
          })
          if (choice[0] === 'Play Tekklar Legion') {
            if (!this.state._tekklarLegionActive) {
              this.state._tekklarLegionActive = {}
            }
            this.state._tekklarLegionActive[holderName] = true

            // If opponent is the Sardakk player (PN owner), they get -1
            if (opponentName === pn.owner) {
              if (!this.state._tekklarLegionPenalty) {
                this.state._tekklarLegionPenalty = {}
              }
              this.state._tekklarLegionPenalty[opponentName] = true
            }

            // Return PN to original owner
            holder.removePromissoryNote('tekklar-legion', pn.owner)
            const ownerPlayer = this.players.byName(pn.owner)
            if (ownerPlayer) {
              ownerPlayer.addPromissoryNote('tekklar-legion', pn.owner)
            }

            this.log.add({
              template: 'Tekklar Legion: {player} returns card to {owner} for +1 combat',
              args: { player: holderName, owner: pn.owner },
            })
          }
        }
      }

      // Greyfire Mutagen (Yin Brotherhood PN)
      // "At the start of a ground combat against 2 or more ground forces that are not
      //  controlled by the Yin player: Replace 1 of your opponent's infantry with 1
      //  infantry from your reinforcements. Then, return this card to the Yin player."
      if (holder.hasPromissoryNote('greyfire-mutagen')) {
        const pn = holder.getPromissoryNotes().find(n => n.id === 'greyfire-mutagen')
        if (pn && pn.owner !== holderName && opponentName !== pn.owner) {
          const planetUnits = this.state.units[systemId]?.planets[planetId] || []
          const opponentForces = planetUnits.filter(u =>
            u.owner === opponentName && (u.type === 'infantry' || u.type === 'mech')
          )
          const opponentInfantry = planetUnits.filter(u =>
            u.owner === opponentName && u.type === 'infantry'
          )

          if (opponentForces.length >= 2 && opponentInfantry.length > 0) {
            const choice = this.actions.choose(holder, ['Play Greyfire Mutagen', 'Pass'], {
              title: 'Greyfire Mutagen: Replace 1 opponent infantry with your own?',
            })
            if (choice[0] === 'Play Greyfire Mutagen') {
              // Replace 1 opponent infantry with holder's infantry
              opponentInfantry[0].owner = holderName

              // Return PN to original owner
              holder.removePromissoryNote('greyfire-mutagen', pn.owner)
              const ownerPlayer = this.players.byName(pn.owner)
              if (ownerPlayer) {
                ownerPlayer.addPromissoryNote('greyfire-mutagen', pn.owner)
              }

              this.log.add({
                template: 'Greyfire Mutagen: {player} replaces 1 {opponent} infantry',
                args: { player: holderName, opponent: opponentName },
              })
            }
          }
        }
      }
    }

    // Ragh's Call (Clan of Saar PN)
    // "After you commit 1 or more units to land on a planet: Remove all of the Saar
    //  player's ground forces from that planet and place them on a planet controlled
    //  by the Saar player. Then, return this card to the Saar player."
    for (const [holderName] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const holder = this.players.byName(holderName)
      if (!holder.hasPromissoryNote('raghs-call')) {
        continue
      }
      const pn = holder.getPromissoryNotes().find(n => n.id === 'raghs-call')
      if (!pn || pn.owner === holderName) {
        continue
      }

      // Only applies when the Saar player (owner) has ground forces on this planet
      const saarPlayerName = pn.owner
      const planetUnits = this.state.units[systemId]?.planets[planetId] || []
      const saarGroundForces = planetUnits.filter(u =>
        u.owner === saarPlayerName && (u.type === 'infantry' || u.type === 'mech')
      )

      if (saarGroundForces.length === 0) {
        continue
      }

      const choice = this.actions.choose(holder, ["Play Ragh's Call", 'Pass'], {
        title: "Ragh's Call: Remove Saar ground forces from this planet?",
      })
      if (choice[0] !== "Play Ragh's Call") {
        continue
      }

      // Find Saar-controlled planets to relocate to
      const saarPlayer = this.players.byName(saarPlayerName)
      const saarPlanets = saarPlayer ? saarPlayer.getControlledPlanets() : []
      // Filter out the current planet
      const validTargets = saarPlanets.filter(p => p !== planetId)

      if (validTargets.length > 0) {
        // Saar chooses destination for their ground forces
        let targetPlanet
        if (validTargets.length === 1) {
          targetPlanet = validTargets[0]
        }
        else {
          const sel = this.actions.choose(saarPlayer, validTargets, {
            title: "Ragh's Call: Choose planet for relocated ground forces",
          })
          targetPlanet = sel[0]
        }

        const targetSystem = this.game._findSystemForPlanet(targetPlanet)
        if (targetSystem) {
          // Move all Saar ground forces from combat planet to target
          for (const gf of saarGroundForces) {
            const idx = planetUnits.findIndex(u => u.id === gf.id)
            if (idx !== -1) {
              planetUnits.splice(idx, 1)
              if (!this.state.units[targetSystem].planets[targetPlanet]) {
                this.state.units[targetSystem].planets[targetPlanet] = []
              }
              this.state.units[targetSystem].planets[targetPlanet].push(gf)
            }
          }
        }
      }
      else {
        // No valid Saar planets — just remove the ground forces
        for (const gf of [...saarGroundForces]) {
          const idx = planetUnits.findIndex(u => u.id === gf.id)
          if (idx !== -1) {
            planetUnits.splice(idx, 1)
          }
        }
      }

      // Return PN to Saar
      holder.removePromissoryNote('raghs-call', pn.owner)
      if (saarPlayer) {
        saarPlayer.addPromissoryNote('raghs-call', pn.owner)
      }

      this.log.add({
        template: "Ragh's Call: {player} removes Saar ground forces from {planet}, card returns to {owner}",
        args: { player: holderName, planet: planetId, owner: pn.owner },
      })
    }
  }

  onGroundCombatRoundStart(systemId, planetId, attackerName, defenderName) {
    for (const [self, opponent] of [[attackerName, defenderName], [defenderName, attackerName]]) {
      const player = this.players.byName(self)
      const handler = this._getPlayerHandler(player)
      handler?.onGroundCombatRoundStart?.(player, this, { systemId, planetId, opponentName: opponent })
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

    // Gift of Prescience: return PN to Naalu at end of status phase
    if (this.state._giftOfPrescience && this.state._giftOfPrescience.holder === player.name) {
      const { owner } = this.state._giftOfPrescience
      const naaluPlayer = this.players.byName(owner)
      if (naaluPlayer) {
        naaluPlayer.addPromissoryNote('gift-of-prescience', owner)
      }
      this.log.add({
        template: 'Gift of Prescience returned to {owner}.',
        args: { owner },
      })
      this.state._giftOfPrescience = null
    }
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

    // Political Favor (Xxcha PN)
    // "When an agenda is revealed: Remove 1 token from the Xxcha player's strategy pool.
    //  Then, discard the revealed agenda and reveal 1 agenda from the top of the deck.
    //  Players vote on this agenda instead. Then, return this card to the Xxcha player."
    for (const player of this.players.all()) {
      if (!player.hasPromissoryNote('political-favor')) {
        continue
      }
      const pn = player.getPromissoryNotes().find(n => n.id === 'political-favor' && n.owner !== player.name)
      if (!pn) {
        continue
      }

      // Check that Xxcha has a strategy token to spend
      const xxchaPlayer = this.players.byName(pn.owner)
      if (!xxchaPlayer || xxchaPlayer.commandTokens.strategy <= 0) {
        continue
      }

      const choice = this.actions.choose(player, ['Play Political Favor', 'Pass'], {
        title: `Political Favor: Discard ${agenda.name} and reveal new agenda?`,
      })
      if (choice[0] !== 'Play Political Favor') {
        continue
      }

      // Remove 1 Xxcha strategy token
      xxchaPlayer.commandTokens.strategy--

      // Draw replacement agenda
      const newAgenda = this.game._drawAgendaCard()

      // Return PN to Xxcha
      player.removePromissoryNote('political-favor', pn.owner)
      xxchaPlayer.addPromissoryNote('political-favor', pn.owner)

      this.log.add({
        template: 'Political Favor: {player} discards {oldAgenda}, reveals {newAgenda}. Card returned to {owner}.',
        args: { player: player.name, oldAgenda: agenda.name, newAgenda: newAgenda?.name || 'none', owner: pn.owner },
      })

      if (newAgenda) {
        return newAgenda
      }
    }

    return null
  }

  onAgendaVotingStart(agenda, outcomes) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onAgendaVotingStart?.(player, this, { agenda, outcomes })
    }

    // Keleres Rider (Council Keleres PN)
    // "After an agenda is revealed: You cannot vote on this agenda. Predict aloud
    //  an outcome of this agenda. If your prediction is correct, draw 1 action card
    //  and gain 2 trade goods. Then, return this card to the Keleres player."
    for (const player of this.players.all()) {
      if (!player.hasPromissoryNote('keleres-rider')) {
        continue
      }
      const pn = player.getPromissoryNotes().find(n => n.id === 'keleres-rider' && n.owner !== player.name)
      if (!pn) {
        continue
      }

      const choice = this.actions.choose(player, ['Play Keleres Rider', 'Pass'], {
        title: `Keleres Rider: Predict outcome of "${agenda.name}"?`,
      })
      if (choice[0] !== 'Play Keleres Rider') {
        continue
      }

      // Player predicts an outcome
      const predictionChoices = outcomes.map(o => `Predict: ${o}`)
      const predSel = this.actions.choose(player, predictionChoices, {
        title: 'Choose your prediction:',
      })
      const predicted = predSel[0].replace('Predict: ', '')

      this.state._keleresRiderPrediction = {
        holder: player.name,
        prediction: predicted,
        owner: pn.owner,
      }

      // Return PN to Keleres
      player.removePromissoryNote('keleres-rider', pn.owner)
      const keleresPlayer = this.players.byName(pn.owner)
      if (keleresPlayer) {
        keleresPlayer.addPromissoryNote('keleres-rider', pn.owner)
      }

      this.log.add({
        template: 'Keleres Rider: {player} predicts {outcome}. Cannot vote. Card returned to {owner}.',
        args: { player: player.name, outcome: predicted, owner: pn.owner },
      })
      break
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

    // Keleres Rider: holder cannot vote
    if (this.state._keleresRiderPrediction) {
      excluded.push(this.state._keleresRiderPrediction.holder)
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

  applyVoteBonuses(votes, playerVotes) {
    // Blood Pact: when holder and Empyrean vote for same outcome, add 4 votes
    for (const pn of (this.state._activatedPNs || [])) {
      if (pn.id !== 'blood-pact') {
        continue
      }

      const holderVote = playerVotes[pn.holder]
      const empyreanVote = playerVotes[pn.owner]
      if (!holderVote || !empyreanVote) {
        continue
      }
      if (holderVote.outcome !== empyreanVote.outcome) {
        continue
      }

      votes[holderVote.outcome] = (votes[holderVote.outcome] || 0) + 4

      this.log.add({
        template: 'Blood Pact: {holder} casts 4 additional votes for {outcome}',
        args: { holder: pn.holder, outcome: holderVote.outcome },
      })
    }
  }

  onAgendaOutcomeResolved(agenda, winningOutcome, playerVotes) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onAgendaOutcomeResolved?.(player, this, { agenda, winningOutcome, playerVotes })
    }

    // Keleres Rider: check prediction
    if (this.state._keleresRiderPrediction) {
      const { holder, prediction } = this.state._keleresRiderPrediction
      const holderPlayer = this.players.byName(holder)

      if (prediction === winningOutcome && holderPlayer) {
        this.game._drawActionCards(holderPlayer, 1)
        holderPlayer.addTradeGoods(2)
        this.log.add({
          template: 'Keleres Rider: {player} predicted correctly! Draws 1 action card and gains 2 trade goods.',
          args: { player: holder },
        })
      }
      else {
        this.log.add({
          template: 'Keleres Rider: {player} predicted incorrectly.',
          args: { player: holder },
        })
      }
      this.state._keleresRiderPrediction = null
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

      // Letani Warrior II (Arborec): after infantry destroyed, roll 1 die; on 6+, save for revival
      if (owner && owner.hasTechnology('letani-warrior-ii')) {
        const roll = Math.floor(this.game.random() * 10) + 1
        if (roll >= 6) {
          if (!this.state.letaniRevival) {
            this.state.letaniRevival = {}
          }
          if (!this.state.letaniRevival[owner.name]) {
            this.state.letaniRevival[owner.name] = 0
          }
          this.state.letaniRevival[owner.name]++
          this.log.add({
            template: 'Letani Warrior II: {player} infantry survives (rolled {roll})',
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

    // Clean up one-shot PN state
    delete this.state._ambuscadeUsed
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

    // Notify all players about combat resolution (e.g., Winnu agent Rickar Rickani)
    for (const player of this.players.all()) {
      const playerHandler = this._getPlayerHandler(player)
      playerHandler?.onAnyCombatResolved?.(player, this, {
        systemId, winnerName, loserName, combatType,
      })
    }

    // Reset combat tracking
    delete this.state._destroyedDuringCombat
    delete this.state._singularityUsedThisCombat
    delete this.state._tekklarLegionActive
    delete this.state._tekklarLegionPenalty
    delete this.state._warFundingActive
    delete this.state._cavalryActive
    delete this.state._ambuscadeUsed
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

    // Agent abilities that trigger on any system activation (push-mode agents)
    for (const otherPlayer of this.players.all()) {
      const otherHandler = this._getPlayerHandler(otherPlayer)
      otherHandler?.onAnySystemActivated?.(otherPlayer, this, { systemId, activatingPlayer: player })
    }

    // Pull-mode agent favors (e.g., Captain Mendosa)
    this._offerFavors('on-system-activated', player, { systemId, activatingPlayer: player })

    // Return activated PNs when holder activates system with PN faction's units
    this._checkActivatedPNReturn(playerName, systemId)
  }

  _checkActivatedPNReturn(activatingPlayerName, systemId) {
    if (!this.state._activatedPNs?.length) {
      return
    }

    const systemUnits = this.state.units[systemId]
    if (!systemUnits) {
      return
    }

    const toReturn = []
    for (let i = this.state._activatedPNs.length - 1; i >= 0; i--) {
      const pn = this.state._activatedPNs[i]
      if (pn.holder !== activatingPlayerName) {
        continue
      }

      // Check if system has units from the PN owner's faction
      const hasOwnerUnits = systemUnits.space.some(u => u.owner === pn.owner) ||
        Object.values(systemUnits.planets || {}).flat().some(u => u.owner === pn.owner)

      if (hasOwnerUnits) {
        toReturn.push(pn)
        this.state._activatedPNs.splice(i, 1)
      }
    }

    for (const pn of toReturn) {
      const holder = this.players.byName(pn.holder)
      const owner = this.players.byName(pn.owner)
      if (holder) {
        holder.removePromissoryNote(pn.id, pn.owner)
      }
      if (owner) {
        owner.addPromissoryNote(pn.id, pn.owner)
      }

      this.log.add({
        template: '{pnName} returned from {holder} to {owner}',
        args: { pnName: pn.id, holder: pn.holder, owner: pn.owner },
      })
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

    // Promissory note turn-start checks
    this._offerTurnStartPromissoryNotes(player)
  }

  _offerTurnStartPromissoryNotes(activePlayer) {
    // Cybernetic Enhancements (L1Z1X PN)
    // "At the start of your turn: Remove 1 token from the L1Z1X player's strategy pool,
    //  if able. Then, place 1 command token in your strategy pool.
    //  Then, return this card to the L1Z1X player."
    if (activePlayer.hasPromissoryNote('cybernetic-enhancements')) {
      const pn = activePlayer.getPromissoryNotes().find(n => n.id === 'cybernetic-enhancements')
      if (pn && pn.owner !== activePlayer.name) {
        const choice = this.actions.choose(activePlayer, ['Play Cybernetic Enhancements', 'Pass'], {
          title: 'Cybernetic Enhancements: Return for strategy token swap?',
        })
        if (choice[0] === 'Play Cybernetic Enhancements') {
          const ownerPlayer = this.players.byName(pn.owner)
          if (ownerPlayer && ownerPlayer.commandTokens.strategy > 0) {
            ownerPlayer.commandTokens.strategy--
          }
          activePlayer.commandTokens.strategy++

          activePlayer.removePromissoryNote('cybernetic-enhancements', pn.owner)
          if (ownerPlayer) {
            ownerPlayer.addPromissoryNote('cybernetic-enhancements', pn.owner)
          }

          this.log.add({
            template: 'Cybernetic Enhancements: {player} gains 1 strategy token, removes 1 from {owner}',
            args: { player: activePlayer.name, owner: pn.owner },
          })
        }
      }
    }

    // Military Support (Sol PN)
    // "At the start of the Sol player's turn: Remove 1 token from the Sol player's strategy pool,
    //  if able. Then, holder places 2 infantry on any planet they control.
    //  Then, return this card to the Sol player."
    if (activePlayer.faction?.id === 'federation-of-sol') {
      for (const holder of this.players.all()) {
        if (holder.name === activePlayer.name) {
          continue
        }
        if (!holder.hasPromissoryNote('military-support')) {
          continue
        }

        const pn = holder.getPromissoryNotes().find(n => n.id === 'military-support')
        if (!pn || pn.owner !== activePlayer.name) {
          continue
        }

        // Remove 1 Sol strategy token
        if (activePlayer.commandTokens.strategy > 0) {
          activePlayer.commandTokens.strategy--
        }

        // Holder places 2 infantry on any planet they control
        const controlledPlanets = holder.getControlledPlanets()
        if (controlledPlanets.length > 0) {
          let targetPlanet
          if (controlledPlanets.length === 1) {
            targetPlanet = controlledPlanets[0]
          }
          else {
            const sel = this.actions.choose(holder, controlledPlanets, {
              title: 'Military Support: Choose planet for 2 infantry',
            })
            targetPlanet = sel[0]
          }
          const systemId = this.game._findSystemForPlanet(targetPlanet)
          if (systemId) {
            for (let i = 0; i < 2; i++) {
              this.game._addUnit(systemId, targetPlanet, 'infantry', holder.name)
            }
          }
        }

        // Return PN
        holder.removePromissoryNote('military-support', pn.owner)
        activePlayer.addPromissoryNote('military-support', pn.owner)

        this.log.add({
          template: 'Military Support: {player} places 2 infantry, card returns to {owner}',
          args: { player: holder.name, owner: activePlayer.name },
        })
      }
    }

    // Spy Net (Yssaril PN)
    // "At the start of your turn: Look at the Yssaril player's hand of action cards.
    //  Choose 1 of those cards and add it to your hand. Then, return this card."
    if (activePlayer.hasPromissoryNote('spy-net')) {
      const pn = activePlayer.getPromissoryNotes().find(n => n.id === 'spy-net' && n.owner !== activePlayer.name)
      if (pn) {
        const yssaril = this.players.byName(pn.owner)
        const yssarilHand = yssaril?.actionCards || []
        if (yssarilHand.length > 0) {
          const choice = this.actions.choose(activePlayer, ['Play Spy Net', 'Pass'], {
            title: `Spy Net: Take 1 action card from ${pn.owner}?`,
          })
          if (choice[0] === 'Play Spy Net') {
            const cardChoices = yssarilHand.map(c => c.name || c.id)
            const cardSelection = this.actions.choose(activePlayer, cardChoices, {
              title: 'Spy Net: Choose action card to take',
            })
            const chosenName = cardSelection[0]
            const cardIdx = yssarilHand.findIndex(c => (c.name || c.id) === chosenName)
            if (cardIdx !== -1) {
              const [taken] = yssarilHand.splice(cardIdx, 1)
              if (!activePlayer.actionCards) {
                activePlayer.actionCards = []
              }
              activePlayer.actionCards.push(taken)
              this.log.add({
                template: 'Spy Net: {player} takes 1 action card from {owner}',
                args: { player: activePlayer.name, owner: pn.owner },
              })
            }

            // Return PN
            activePlayer.removePromissoryNote('spy-net', pn.owner)
            if (yssaril) {
              yssaril.addPromissoryNote('spy-net', pn.owner)
            }
            this.log.add({
              template: '{pnName} returned from {holder} to {owner}',
              args: { pnName: 'Spy Net', holder: activePlayer.name, owner: pn.owner },
            })
          }
        }
      }
    }

    // Creuss IFF (Ghosts of Creuss PN)
    // "At the start of your turn during the action phase: Place or move a Creuss
    //  wormhole token into either a system that contains a planet you control or a
    //  non-home system that does not contain another player's ships.
    //  Then, return this card to the Creuss player."
    if (activePlayer.hasPromissoryNote('creuss-iff')) {
      const pn = activePlayer.getPromissoryNotes().find(n => n.id === 'creuss-iff' && n.owner !== activePlayer.name)
      if (pn) {
        // Find valid systems for wormhole token placement
        const validSystems = []
        const isHomeSystem = (id) => String(id).endsWith('-home') || String(id).endsWith('-gate')
        for (const [systemId] of Object.entries(this.state.systems)) {
          // Skip system that already has the token
          if (this.state.creussWormholeToken === String(systemId)) {
            continue
          }

          // Option A: any system with a planet controlled by the holder (including home)
          const tile = this.game.res.getSystemTile(systemId) || this.game.res.getSystemTile(Number(systemId))
          const hasControlledPlanet = (tile?.planets || []).some(
            pId => this.state.planets[pId]?.controller === activePlayer.name
          )
          if (hasControlledPlanet) {
            validSystems.push(systemId)
            continue
          }

          // Option B: non-home system without opponent ships
          if (!isHomeSystem(systemId)) {
            const systemUnits = this.state.units[systemId]
            const hasOpponentShips = systemUnits?.space.some(
              u => u.owner !== activePlayer.name
            )
            if (!hasOpponentShips) {
              validSystems.push(systemId)
            }
          }
        }

        if (validSystems.length > 0) {
          const choice = this.actions.choose(activePlayer, ['Play Creuss IFF', 'Pass'], {
            title: 'Creuss IFF: Place or move Creuss wormhole token?',
          })
          if (choice[0] === 'Play Creuss IFF') {
            let targetSystem
            if (validSystems.length === 1) {
              targetSystem = validSystems[0]
            }
            else {
              const sel = this.actions.choose(activePlayer, validSystems, {
                title: 'Creuss IFF: Place wormhole token in which system?',
              })
              targetSystem = sel[0]
            }

            this.state.creussWormholeToken = String(targetSystem)

            // Return PN to Creuss player
            activePlayer.removePromissoryNote('creuss-iff', pn.owner)
            const ownerPlayer = this.players.byName(pn.owner)
            if (ownerPlayer) {
              ownerPlayer.addPromissoryNote('creuss-iff', pn.owner)
            }

            this.log.add({
              template: 'Creuss IFF: {player} places wormhole token in system {system}, card returns to {owner}',
              args: { player: activePlayer.name, system: targetSystem, owner: pn.owner },
            })
          }
        }
      }
    }
  }

  onStrategyPhaseStart(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStrategyPhaseStart?.(player, this)

    // Scepter of Dominion (Mahact PN)
    // "At the start of the strategy phase: Choose 1 non-home system that contains your
    //  units; each other player who has a token on the Mahact player's command sheet
    //  places a token from their reinforcements in that system.
    //  Then, return this card to the Mahact player."
    if (player.hasPromissoryNote('scepter-of-dominion')) {
      const pn = player.getPromissoryNotes().find(n => n.id === 'scepter-of-dominion' && n.owner !== player.name)
      if (pn) {
        const mahactPlayer = this.players.byName(pn.owner)
        const capturedTokens = this.state.capturedCommandTokens[pn.owner] || []

        // Only useful if Mahact has captured tokens from other players
        if (capturedTokens.length > 0) {
          // Find non-home systems with holder's units
          const validSystems = []
          for (const [systemId] of Object.entries(this.state.systems)) {
            if (String(systemId).endsWith('-home') || String(systemId).endsWith('-gate')) {
              continue
            }
            const systemUnits = this.state.units[systemId]
            const hasOwnUnits = systemUnits?.space.some(u => u.owner === player.name)
              || Object.values(systemUnits?.planets || {}).some(arr =>
                arr.some(u => u.owner === player.name)
              )
            if (hasOwnUnits) {
              validSystems.push(systemId)
            }
          }

          if (validSystems.length > 0) {
            const choice = this.actions.choose(player, ['Play Scepter of Dominion', 'Pass'], {
              title: 'Scepter of Dominion: Force captured players to place tokens?',
            })
            if (choice[0] === 'Play Scepter of Dominion') {
              let targetSystem
              if (validSystems.length === 1) {
                targetSystem = validSystems[0]
              }
              else {
                const sel = this.actions.choose(player, validSystems, {
                  title: 'Choose system for command tokens:',
                })
                targetSystem = sel[0]
              }

              // Each captured player places a command token
              for (const capturedName of capturedTokens) {
                if (!this.state.systems[targetSystem].commandTokens) {
                  this.state.systems[targetSystem].commandTokens = []
                }
                if (!this.state.systems[targetSystem].commandTokens.includes(capturedName)) {
                  this.state.systems[targetSystem].commandTokens.push(capturedName)
                }
              }

              // Return PN to Mahact
              player.removePromissoryNote('scepter-of-dominion', pn.owner)
              if (mahactPlayer) {
                mahactPlayer.addPromissoryNote('scepter-of-dominion', pn.owner)
              }

              this.log.add({
                template: 'Scepter of Dominion: {player} places tokens in system {system}. Card returned to {owner}.',
                args: { player: player.name, system: targetSystem, owner: pn.owner },
              })
            }
          }
        }
      }
    }
  }

  onStrategyPhaseEnd(player) {
    const handler = this._getPlayerHandler(player)
    handler?.onStrategyPhaseEnd?.(player, this)

    // Gift of Prescience (Naalu PN)
    // "At the end of the strategy phase: Place this card face-up in your play area
    //  and place the Naalu '0' token on your strategy card; you are first in the
    //  initiative order. The Naalu player cannot use their TELEPATHIC faction ability
    //  during this game round. Return this card to the Naalu player at the end of
    //  the status phase."
    if (player.hasPromissoryNote('gift-of-prescience')) {
      const pn = player.getPromissoryNotes().find(n => n.id === 'gift-of-prescience' && n.owner !== player.name)
      if (pn) {
        const choice = this.actions.choose(player, ['Play Gift of Prescience', 'Pass'], {
          title: 'Gift of Prescience: Gain initiative 0 this round?',
        })
        if (choice[0] === 'Play Gift of Prescience') {
          this.state._giftOfPrescience = { holder: player.name, owner: pn.owner }
          player.removePromissoryNote('gift-of-prescience', pn.owner)

          this.log.add({
            template: 'Gift of Prescience: {player} gains initiative 0. {owner} cannot use Telepathic this round.',
            args: { player: player.name, owner: pn.owner },
          })
        }
      }
    }
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

  onCommoditiesReplenished(replenishingPlayer) {
    for (const player of this.players.all()) {
      const handler = this._getPlayerHandler(player)
      handler?.onCommoditiesReplenished?.(player, this, { replenishingPlayer })
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
  // Y0. Transport Capacity Exemptions
  // ---------------------------------------------------------------------------

  isCapacityExempt(player, unitType) {
    const handler = this._getPlayerHandler(player)
    return handler?.isCapacityExempt?.(player, this, unitType) ?? false
  }


  // ---------------------------------------------------------------------------
  // Y1. Bombardment Triggers
  // ---------------------------------------------------------------------------

  afterBombardment(attackerName, systemId, planetId, totalHits) {
    const attacker = this.players.byName(attackerName)
    const handler = this._getPlayerHandler(attacker)
    handler?.afterBombardment?.(attacker, this, { systemId, planetId, totalHits })
  }


  // ---------------------------------------------------------------------------
  // Y2. Component Action Triggers
  // ---------------------------------------------------------------------------

  afterComponentAction(player) {
    const handler = this._getPlayerHandler(player)
    handler?.afterComponentAction?.(player, this)
  }


  // ---------------------------------------------------------------------------
  // Y3. Invasion Influence Cost
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
