const res = require('../../res/index.js')

module.exports = {
  canResearchNormally() {
    return false
  },
  isExcludedFromVoting: true,

  // Mordred mech: +2 combat against opponent with Valefar assimilator token
  getCombatModifier(player, ctx) {
    const opponentName = ctx.state._combatOpponent?.[player.name]
    if (!opponentName) {
      return 0
    }

    const tokens = ctx.state.assimilatorTokens || {}
    const hasTokenOnOpponent =
      (tokens.x?.ownerName === opponentName) ||
      (tokens.y?.ownerName === opponentName) ||
      (tokens.z?.ownerName === opponentName)

    return hasTokenOnOpponent ? -2 : 0
  },

  // Commander — Nekro Acidos: After you gain a technology, draw 1 action card.
  _commanderDrawCard(player, ctx) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    ctx.game._drawActionCards(player, 1)
    ctx.log.add({
      template: 'Nekro Acidos: {player} draws 1 action card',
      args: { player: player.name },
    })
  },

  // ---------------------------------------------------------------------------
  // Valefar Assimilator helpers
  // ---------------------------------------------------------------------------

  /**
   * Returns array of assimilator tokens ('x', 'y') that the player owns and
   * that have not yet been placed on an opponent's faction technology.
   */
  _getAvailableAssimilators(player, ctx) {
    const available = []
    const tokens = ctx.state.assimilatorTokens || {}

    if (player.hasTechnology('valefar-assimilator-x') && !tokens.x) {
      available.push('x')
    }
    if (player.hasTechnology('valefar-assimilator-y') && !tokens.y) {
      available.push('y')
    }
    return available
  },

  _isZAvailable(player, ctx) {
    const tokens = ctx.state.assimilatorTokens || {}
    return player.hasTechnology('valefar-assimilator-z') && !tokens.z
  },

  /**
   * Gets eligible faction technologies from the given opponent that can receive
   * an assimilator token (no existing token on them).
   */
  _getEligibleFactionTechs(owner, ctx) {
    if (!owner.faction?.factionTechnologies) {
      return []
    }
    const tokens = ctx.state.assimilatorTokens || {}
    const placedTechIds = new Set()
    if (tokens.x) {
      placedTechIds.add(tokens.x.techId)
    }
    if (tokens.y) {
      placedTechIds.add(tokens.y.techId)
    }

    return owner.faction.factionTechnologies
      .filter(ft => owner.hasTechnology(ft.id) && !placedTechIds.has(ft.id))
      .map(ft => ft.id)
  },

  /**
   * After Nekro would gain a technology, offer to place an assimilator token
   * on an opponent's faction technology instead. Returns true if an assimilator
   * was placed (meaning the normal tech gain was replaced).
   */
  _offerAssimilatorPlacement(player, ctx, ownerName) {
    const availableTokens = this._getAvailableAssimilators(player, ctx)
    if (availableTokens.length === 0) {
      return false
    }

    const owner = ctx.players.byName(ownerName)
    if (!owner) {
      return false
    }

    const eligibleFactionTechs = this._getEligibleFactionTechs(owner, ctx)
    if (eligibleFactionTechs.length === 0) {
      return false
    }

    // Build choice list: each assimilator token × each faction tech, plus Pass
    const choices = [ctx.actions.option({ id: 'normal', title: 'Gain technology normally' })]
    for (const token of availableTokens) {
      for (const techId of eligibleFactionTechs) {
        choices.push(ctx.actions.option({
          id: `place:${token}:${techId}`,
          title: `Place ${token.toUpperCase()} token on ${techId}`,
          kind: 'assimilator',
        }))
      }
    }

    const selection = ctx.actions.choose(player, choices, {
      title: 'Valefar Assimilator: Place token on a faction technology instead?',
    })

    const vaPick = selection[0]
    const vaPickId = (vaPick && typeof vaPick === 'object') ? vaPick.id : vaPick
    const vaPickTitle = (vaPick && typeof vaPick === 'object') ? vaPick.title : vaPick
    if (vaPickId === 'normal' || vaPickTitle === 'Gain technology normally') {
      return false
    }

    let tokenLetter, targetTechId
    if (typeof vaPickId === 'string' && vaPickId.startsWith('place:')) {
      const parts = vaPickId.split(':')
      tokenLetter = parts[1]
      targetTechId = parts.slice(2).join(':')
    }
    else {
      // Parse the title: "Place X token on tech-id"
      const vaTok = typeof vaPickId === 'string' ? vaPickId : (vaPickTitle || '')
      const match = String(vaTok).match(/^Place ([XY]) token on (.+)$/)
      if (!match) {
        return false
      }
      tokenLetter = match[1].toLowerCase()
      targetTechId = match[2]
    }

    if (!ctx.state.assimilatorTokens) {
      ctx.state.assimilatorTokens = {}
    }
    ctx.state.assimilatorTokens[tokenLetter] = {
      techId: targetTechId,
      ownerName: ownerName,
    }

    ctx.log.add({
      template: '{player} places Valefar Assimilator {token} on {tech} (owned by {owner})',
      args: { player: player.name, token: tokenLetter.toUpperCase(), tech: targetTechId, owner: ownerName },
    })

    this._commanderDrawCard(player, ctx)
    return true
  },

  /**
   * Returns the tech ID that the given assimilator token is currently copying,
   * or null if the token is not placed.
   */
  _getAssimilatedTechId(ctx, token) {
    const tokens = ctx.state.assimilatorTokens || {}
    return tokens[token]?.techId || null
  },

  // ---------------------------------------------------------------------------
  // Agent — Nekro Malleon: component action during action phase
  // ---------------------------------------------------------------------------

  componentActions: [
    {
      id: 'nekro-malleon',
      name: 'Nekro Malleon',
      abilityId: 'galactic-threat', // Any Nekro ability — just needs to match
      isAvailable: function(player) {
        return player.isAgentReady()
      },
    },
    {
      id: 'polymorphic-algorithm',
      name: 'UNIT.DSGN.FLAYESH',
      abilityId: 'galactic-threat',
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  nekroMalleon(ctx, player) {
    player.exhaustAgent()

    const others = ctx.players.all().filter(p => p.name !== player.name)

    const targetSelection = ctx.actions.choose(
      player,
      others.map(p => ctx.actions.playerOption(p)),
      {
        title: 'Nekro Malleon: Choose a player',
      },
    )
    const nmtPick = targetSelection[0]
    const targetName = (nmtPick && typeof nmtPick === 'object') ? nmtPick.id : nmtPick
    const target = ctx.players.byName(targetName)

    // The chosen player decides: discard action card, spend command token, or decline
    const options = []
    const hasActionCards = (target.actionCards || []).length > 0
    if (hasActionCards) {
      options.push(ctx.actions.option({ id: 'discard', title: 'Discard Action Card' }))
    }
    const totalTokens = target.commandTokens.tactics + target.commandTokens.fleet + target.commandTokens.strategy
    if (totalTokens > 0) {
      options.push(ctx.actions.option({ id: 'spend', title: 'Spend Command Token' }))
    }
    options.push(ctx.actions.option({ id: 'decline', title: 'Decline' }))

    if (options.length === 1) {
      // Only 'Decline' available — no action cards, no tokens
      ctx.log.add({
        template: 'Nekro Malleon: {player} targets {target}, but {target} has nothing to give',
        args: { player: player.name, target: targetName },
      })
      return
    }

    const choice = ctx.actions.choose(target, options, {
      title: 'Nekro Malleon: Discard 1 action card or spend 1 command token to gain 2 trade goods?',
    })

    const nmPick = choice[0]
    const nmPickId = (nmPick && typeof nmPick === 'object') ? nmPick.id : nmPick
    const nmPickTitle = (nmPick && typeof nmPick === 'object') ? nmPick.title : nmPick
    if (nmPickId === 'discard' || nmPickTitle === 'Discard Action Card') {
      const cards = target.actionCards || []
      const cardChoices = cards.map(c => ctx.actions.option({ id: c.id, title: c.id, kind: 'action-card' }))
      const cardSelection = ctx.actions.choose(target, cardChoices, {
        title: 'Choose action card to discard',
      })
      const ncPick = cardSelection[0]
      const cardId = (ncPick && typeof ncPick === 'object') ? ncPick.id : ncPick
      target.actionCards = target.actionCards.filter(c => c.id !== cardId)
      target.addTradeGoods(2)

      ctx.log.add({
        template: 'Nekro Malleon: {target} discards an action card and gains 2 trade goods',
        args: { player: player.name, target: targetName },
      })
    }
    else if (nmPickId === 'spend' || nmPickTitle === 'Spend Command Token') {
      const poolChoices = []
      if (target.commandTokens.tactics > 0) {
        poolChoices.push('tactics')
      }
      if (target.commandTokens.fleet > 0) {
        poolChoices.push('fleet')
      }
      if (target.commandTokens.strategy > 0) {
        poolChoices.push('strategy')
      }

      const poolSelection = ctx.actions.choose(target, poolChoices, {
        title: 'Spend command token from which pool?',
      })
      const npPick = poolSelection[0]
      const pool = (npPick && typeof npPick === 'object') ? npPick.id : npPick
      target.commandTokens[pool]--
      target.addTradeGoods(2)

      ctx.log.add({
        template: 'Nekro Malleon: {target} spends 1 {pool} command token and gains 2 trade goods',
        args: { player: player.name, target: targetName, pool },
      })
    }
    else {
      ctx.log.add({
        template: 'Nekro Malleon: {target} declines',
        args: { player: player.name, target: targetName },
      })
    }
  },

  // ---------------------------------------------------------------------------
  // Agenda Phase
  // ---------------------------------------------------------------------------

  onAgendaVotingStart(player, ctx, { agenda, outcomes }) {
    const choices = outcomes.map(o => ctx.actions.option({
      id: `predict:${o}`,
      title: `Predict: ${o}`,
      kind: 'prediction',
    }))
    choices.push(ctx.actions.option({ id: 'no-prediction', title: 'No prediction' }))

    const selection = ctx.actions.choose(player, choices, {
      title: `Galactic Threat: Predict outcome of "${agenda.name}"`,
    })

    const gtPick = selection[0]
    const gtPickId = (gtPick && typeof gtPick === 'object') ? gtPick.id : gtPick
    const gtPickTitle = (gtPick && typeof gtPick === 'object') ? gtPick.title : gtPick
    if (gtPickId !== 'no-prediction' && gtPickTitle !== 'No prediction') {
      let predicted
      if (typeof gtPickId === 'string' && gtPickId.startsWith('predict:')) {
        predicted = gtPickId.slice('predict:'.length)
      }
      else {
        const gtTok = typeof gtPickId === 'string' ? gtPickId : (gtPickTitle || '')
        predicted = String(gtTok).replace('Predict: ', '')
      }
      ctx.state.nekroPrediction = { playerName: player.name, outcome: predicted }

      ctx.log.add({
        template: '{player} predicts: {outcome} (Galactic Threat)',
        args: { player, outcome: predicted },
      })
    }
  },

  onAgendaOutcomeResolved(player, ctx, { winningOutcome, playerVotes }) {
    if (!ctx.state.nekroPrediction) {
      return
    }
    if (ctx.state.nekroPrediction.playerName !== player.name) {
      return
    }

    const { outcome } = ctx.state.nekroPrediction
    ctx.state.nekroPrediction = null

    if (outcome !== winningOutcome) {
      ctx.log.add({
        template: '{player} predicted incorrectly (Galactic Threat)',
        args: { player },
      })
      return
    }

    // Only consider techs from players who voted for the predicted outcome
    const eligibleVoters = Object.entries(playerVotes || {})
      .filter(([name, vote]) => vote.outcome === winningOutcome && name !== player.name)
      .map(([name]) => name)

    const allTechs = []
    const techOwners = {} // techId → ownerName (for assimilator targeting)
    for (const voterName of eligibleVoters) {
      const voter = ctx.players.byName(voterName)
      if (!voter) {
        continue
      }
      for (const techId of voter.getTechIds()) {
        if (!player.hasTechnology(techId)) {
          allTechs.push(techId)
          techOwners[techId] = voterName
        }
      }
    }

    const unique = [...new Set(allTechs)]
    if (unique.length === 0) {
      ctx.log.add({
        template: '{player} predicted correctly but no copyable technologies from eligible voters (Galactic Threat)',
        args: { player },
      })
      return
    }

    // Check if assimilator placement is possible for any eligible voter
    const availableTokens = this._getAvailableAssimilators(player, ctx)
    if (availableTokens.length > 0) {
      // Check all eligible voters for faction techs
      for (const voterName of eligibleVoters) {
        const voter = ctx.players.byName(voterName)
        if (!voter) {
          continue
        }
        const eligible = this._getEligibleFactionTechs(voter, ctx)
        if (eligible.length > 0) {
          // Offer assimilator placement (picks any eligible voter with faction techs)
          const placed = this._offerAssimilatorPlacement(player, ctx, voterName)
          if (placed) {
            return
          }
          break // Only offer once
        }
      }
    }

    const selection = ctx.actions.choose(
      player,
      unique.map(t => ctx.actions.option({ id: t, title: t, kind: 'tech' })),
      {
        title: 'Galactic Threat: Correct prediction — choose technology to copy',
      },
    )

    const gtcPick = selection[0]
    const techId = (gtcPick && typeof gtcPick === 'object') ? gtcPick.id : gtcPick
    ctx.game._grantTechnology(player, techId)

    ctx.log.add({
      template: '{player} gains {tech} (correct Galactic Threat prediction)',
      args: { player, tech: techId },
    })

    this._commanderDrawCard(player, ctx)
  },

  // ---------------------------------------------------------------------------
  // Technological Singularity — tech parasitism on unit destruction
  // ---------------------------------------------------------------------------

  onUnitDestroyed(player, ctx, { systemId: _systemId, unit }) {
    // Only triggers during combat, not from hero/ability destruction
    if (ctx.state._suppressSingularity) {
      return
    }
    // Once per combat
    if (ctx.state._singularityUsedThisCombat) {
      return
    }

    // Antivirus: unit owner is immune to Technological Singularity
    if ((ctx.state._activatedPNs || []).some(p => p.id === 'antivirus' && p.holder === unit.owner)) {
      return
    }

    const owner = ctx.players.byName(unit.owner)
    if (!owner) {
      return
    }

    const ownerTechs = owner.getTechIds().filter(id => !player.hasTechnology(id))
    if (ownerTechs.length === 0) {
      return
    }

    // Check if assimilator placement is available
    const availableTokens = this._getAvailableAssimilators(player, ctx)
    const eligibleFactionTechs = this._getEligibleFactionTechs(owner, ctx)
    const zAvailable = this._isZAvailable(player, ctx)

    if (availableTokens.length > 0 && eligibleFactionTechs.length > 0 || zAvailable) {
      // Build combined choices: normal techs + assimilator placements + Pass
      const choices = [ctx.actions.option({ id: 'pass', title: 'Pass' })]

      // Normal tech copy choices
      for (const techId of ownerTechs) {
        choices.push(ctx.actions.option({ id: `tech:${techId}`, title: techId, kind: 'technology' }))
      }

      // X/Y assimilator placement choices (on faction techs)
      for (const token of availableTokens) {
        for (const techId of eligibleFactionTechs) {
          choices.push(ctx.actions.option({
            id: `assim-xy:${token}:${techId}`,
            title: `Place ${token.toUpperCase()} token on ${techId}`,
          }))
        }
      }

      // Z assimilator placement choice (on faction sheet)
      if (zAvailable) {
        choices.push(ctx.actions.option({
          id: `assim-z:${owner.faction.id}`,
          title: `Place Z on ${owner.faction.id}`,
        }))
      }

      const selection = ctx.actions.choose(player, choices, {
        title: `Technological Singularity: Copy a technology from ${unit.owner}?`,
      })

      const npick = selection[0]
      const npickId = (npick && typeof npick === 'object') ? npick.id : npick
      if (npickId === 'pass' || npickId === 'Pass') {
        return
      }

      ctx.state._singularityUsedThisCombat = true

      // Check if Z assimilator placement was chosen
      if (typeof npickId === 'string' && npickId.startsWith('assim-z:')) {
        const factionId = npickId.slice('assim-z:'.length)
        if (!ctx.state.assimilatorTokens) {
          ctx.state.assimilatorTokens = {}
        }
        ctx.state.assimilatorTokens.z = {
          factionId,
          ownerName: unit.owner,
        }

        ctx.log.add({
          template: '{player} places Valefar Assimilator Z on {faction} faction sheet (Technological Singularity)',
          args: { player: player.name, faction: factionId },
        })

        this._commanderDrawCard(player, ctx)
        return
      }

      // Check if X/Y assimilator placement was chosen
      if (typeof npickId === 'string' && npickId.startsWith('assim-xy:')) {
        const [, tokenLetter, targetTechId] = npickId.split(':')

        if (!ctx.state.assimilatorTokens) {
          ctx.state.assimilatorTokens = {}
        }
        ctx.state.assimilatorTokens[tokenLetter] = {
          techId: targetTechId,
          ownerName: unit.owner,
        }

        ctx.log.add({
          template: '{player} places Valefar Assimilator {token} on {tech} (owned by {owner}) (Technological Singularity)',
          args: { player: player.name, token: tokenLetter.toUpperCase(), tech: targetTechId, owner: unit.owner },
        })

        this._commanderDrawCard(player, ctx)
        return
      }

      // Normal tech copy
      const techId = typeof npickId === 'string' && npickId.startsWith('tech:')
        ? npickId.slice('tech:'.length)
        : npickId
      ctx.game._grantTechnology(player, techId)

      ctx.log.add({
        template: '{player} copies {tech} from {target} (Technological Singularity)',
        args: { player, tech: techId, target: unit.owner },
      })

      this._commanderDrawCard(player, ctx)
      return
    }

    // No assimilator available — original flow
    const choices = [
      ctx.actions.option({ id: 'pass', title: 'Pass' }),
      ...ownerTechs.map(t => ctx.actions.option({ id: t, title: t, kind: 'technology' })),
    ]
    const selection = ctx.actions.choose(player, choices, {
      title: `Technological Singularity: Copy a technology from ${unit.owner}?`,
    })

    const pick = selection[0]
    const pickId = (pick && typeof pick === 'object') ? pick.id : pick
    if (pickId === 'pass' || pickId === 'Pass') {
      return
    }

    ctx.state._singularityUsedThisCombat = true
    const techId = pickId
    ctx.game._grantTechnology(player, techId)

    ctx.log.add({
      template: '{player} copies {tech} from {target} (Technological Singularity)',
      args: { player, tech: techId, target: unit.owner },
    })

    this._commanderDrawCard(player, ctx)
  },

  // ---------------------------------------------------------------------------
  // Hero — UNIT.DSGN.FLAYESH: POLYMORPHIC ALGORITHM
  // ---------------------------------------------------------------------------

  polymorphicAlgorithm(ctx, player) {
    // Find planets with tech specialty in systems containing player's units
    const validPlanets = []

    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      // Must have player's units in the system (space or on any planet)
      const hasPlayerUnits =
        systemUnits.space.some(u => u.owner === player.name) ||
        Object.values(systemUnits.planets).some(
          planetUnits => planetUnits.some(u => u.owner === player.name)
        )

      if (!hasPlayerUnits) {
        continue
      }

      const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
      if (!tile || !tile.planets) {
        continue
      }

      for (const planetId of tile.planets) {
        const planetData = res.getPlanet(planetId)
        if (planetData && planetData.techSpecialty) {
          validPlanets.push({
            planetId,
            systemId,
            techSpecialty: planetData.techSpecialty,
            resources: planetData.resources || 0,
            influence: planetData.influence || 0,
          })
        }
      }
    }

    if (validPlanets.length === 0) {
      ctx.log.add({
        template: 'POLYMORPHIC ALGORITHM: No valid planets with tech specialties',
        args: {},
      })
      return
    }

    // Choose planet
    const planetChoiceObjs = validPlanets.map(p => ctx.actions.planetOption(p.planetId))
    let chosenPlanetId
    if (planetChoiceObjs.length === 1) {
      chosenPlanetId = validPlanets[0].planetId
    }
    else {
      const selection = ctx.actions.choose(player, planetChoiceObjs, {
        title: 'POLYMORPHIC ALGORITHM: Choose planet with tech specialty',
      })
      const ppick = selection[0]
      chosenPlanetId = (ppick && typeof ppick === 'object') ? ppick.id : ppick
    }

    const chosen = validPlanets.find(p => p.planetId === chosenPlanetId)

    // Destroy all other players' units on that planet
    // Suppress Technological Singularity — hero destruction is not combat
    ctx.state._suppressSingularity = true

    const systemUnits = ctx.state.units[chosen.systemId]
    const planetUnits = systemUnits.planets[chosen.planetId] || []
    const toDestroy = planetUnits.filter(u => u.owner !== player.name)

    for (const unit of toDestroy) {
      const idx = planetUnits.findIndex(u => u.id === unit.id)
      if (idx !== -1) {
        planetUnits.splice(idx, 1)
        ctx.game.factionAbilities.onUnitDestroyed(chosen.systemId, unit, player.name, chosen.planetId)
      }
    }

    delete ctx.state._suppressSingularity

    if (toDestroy.length > 0) {
      ctx.log.add({
        template: 'POLYMORPHIC ALGORITHM: {player} destroys {count} units on {planet}',
        args: { player: player.name, count: toDestroy.length, planet: chosen.planetId },
      })
    }

    // Gain trade goods equal to combined resource + influence
    const tradeGoodsGain = chosen.resources + chosen.influence
    if (tradeGoodsGain > 0) {
      player.addTradeGoods(tradeGoodsGain)
      ctx.log.add({
        template: 'POLYMORPHIC ALGORITHM: {player} gains {amount} trade goods',
        args: { player: player.name, amount: tradeGoodsGain },
      })
    }

    // Gain 1 technology matching the specialty of that planet
    const specialty = chosen.techSpecialty
    const allTechs = [...res.getGenericTechnologies()]
    if (player.faction?.factionTechnologies) {
      allTechs.push(...player.faction.factionTechnologies)
    }

    // Also include faction techs from all factions (since Nekro copies techs)
    for (const otherPlayer of ctx.players.all()) {
      if (otherPlayer.name !== player.name && otherPlayer.faction?.factionTechnologies) {
        allTechs.push(...otherPlayer.faction.factionTechnologies)
      }
    }

    const matchingTechs = allTechs
      .filter(t => t.color === specialty && !player.hasTechnology(t.id))
      .map(t => t.id)
    const uniqueMatching = [...new Set(matchingTechs)]

    if (uniqueMatching.length > 0) {
      let chosenTechId
      if (uniqueMatching.length === 1) {
        chosenTechId = uniqueMatching[0]
      }
      else {
        const techSelection = ctx.actions.choose(
          player,
          uniqueMatching.map(t => ctx.actions.option({ id: t, title: t, kind: 'technology' })),
          { title: `POLYMORPHIC ALGORITHM: Gain a ${specialty} technology` },
        )
        const tpick = techSelection[0]
        chosenTechId = (tpick && typeof tpick === 'object') ? tpick.id : tpick
      }

      ctx.game._grantTechnology(player, chosenTechId)
      ctx.log.add({
        template: 'POLYMORPHIC ALGORITHM: {player} gains {tech}',
        args: { player: player.name, tech: chosenTechId },
      })

      this._commanderDrawCard(player, ctx)
    }

    // Purge hero
    player.purgeHero()
    ctx.log.add({
      template: '{player} purges UNIT.DSGN.FLAYESH',
      args: { player: player.name },
    })
  },
}
