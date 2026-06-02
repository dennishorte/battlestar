module.exports = {
  getExplorationBonus(player, ctx, planetId) {
    const systemId = ctx.game._findSystemForPlanet(planetId)
    if (!systemId) {
      return 0
    }

    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    const hasMech = planetUnits.some(u => u.owner === player.name && u.type === 'mech')
    return hasMech ? 1 : 0
  },

  // Commander — Dart and Tai: After you gain control of a planet that was
  // controlled by another player, you may explore that planet.
  onPlanetGained(player, ctx, { planetId, previousController }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    // Only triggers when taking a planet from another player
    if (!previousController || previousController === player.name) {
      return
    }

    // Check if the planet has a trait (explorable)
    const planet = ctx.game.res.getPlanet(planetId)
    if (!planet || !planet.trait) {
      return
    }

    // Check if already explored
    if (ctx.state.exploredPlanets[planetId]) {
      return
    }

    const choice = ctx.actions.choose(player, [
      ctx.actions.option({ id: 'explore', title: 'Explore' }),
      ctx.actions.option({ id: 'pass', title: 'Pass' }),
    ], {
      title: `Dart and Tai: Explore ${planetId}?`,
    })

    const dtPick = choice[0]
    const dtPickId = (dtPick && typeof dtPick === 'object') ? dtPick.id : dtPick
    if (dtPickId === 'explore' || dtPick === 'Explore') {
      ctx.game._explorePlanet(planetId, player.name)

      ctx.log.add({
        template: 'Dart and Tai: {player} explores {planet}',
        args: { player: player.name, planet: planetId },
      })
    }
  },

  // Supercharge (faction tech): At the start of a combat round, exhaust this
  // card to apply +1 to all combat rolls for this combat round.
  getCombatModifier(player, ctx) {
    if (ctx.state._superchargeActive?.[player.name]) {
      return -1  // negative = bonus (lower combat threshold = easier to hit)
    }
    return 0
  },

  _offerSupercharge(player, ctx) {
    if (!player.hasTechnology('supercharge')) {
      return
    }
    if (!ctx.game._isTechReady(player, 'supercharge')) {
      return
    }

    const choice = ctx.actions.choose(player, [
      ctx.actions.option({ id: 'exhaust', title: 'Exhaust Supercharge' }),
      ctx.actions.option({ id: 'pass', title: 'Pass' }),
    ], {
      title: 'Supercharge: Exhaust to apply +1 to all combat rolls this round?',
    })

    const scPick = choice[0]
    const scPickId = (scPick && typeof scPick === 'object') ? scPick.id : scPick
    if (scPickId === 'exhaust' || scPick === 'Exhaust Supercharge') {
      ctx.game._exhaustTech(player, 'supercharge')
      if (!ctx.state._superchargeActive) {
        ctx.state._superchargeActive = {}
      }
      ctx.state._superchargeActive[player.name] = true

      ctx.log.add({
        template: '{player} exhausts Supercharge for +1 to combat rolls this round',
        args: { player: player.name },
      })
    }
  },

  onSpaceCombatRound(player, ctx, _context) {
    this._offerSupercharge(player, ctx)
  },

  afterSpaceCombatRound(player, ctx, _context) {
    if (ctx.state._superchargeActive?.[player.name]) {
      delete ctx.state._superchargeActive[player.name]
    }
  },

  onGroundCombatStart(player, ctx, _context) {
    // Supercharge can also be used for ground combat
    this._offerSupercharge(player, ctx)
  },

  onGroundCombatRoundEnd(player, ctx, _context) {
    if (ctx.state._superchargeActive?.[player.name]) {
      delete ctx.state._superchargeActive[player.name]
    }
  },

  // Pre-Fab Arcologies (faction tech): After you explore a planet, ready that planet.
  afterExploration(player, ctx, planetId) {
    if (player.hasTechnology('pre-fab-arcologies')) {
      if (ctx.state.planets[planetId]) {
        ctx.state.planets[planetId].exhausted = false
        ctx.log.add({
          template: 'Pre-Fab Arcologies: {player} readies {planet}',
          args: { player: player.name, planet: planetId },
        })
      }
    }

    // Eidolon DEPLOY: after exploring a planet, may place 1 mech
    this._offerEidolonDeploy(player, ctx)
  },

  componentActions: [
    {
      id: 'fabrication',
      name: 'Fabrication',
      abilityId: 'fabrication',
      isAvailable: (player) => (player.relicFragments || []).length >= 1,
    },
    {
      id: 'perfect-synthesis',
      name: 'Hesh and Prit (Perfect Synthesis)',
      abilityId: 'distant-suns', // Naaz-Rokha players have this ability
      isAvailable: (player) => player.isHeroUnlocked() && !player.isHeroPurged(),
    },
  ],

  // ---------------------------------------------------------------------------
  // Mech — Eidolon: DEPLOY
  // After you use FABRICATION or explore a planet, place 1 mech from your
  // reinforcements on a planet you control.
  // ---------------------------------------------------------------------------

  _offerEidolonDeploy(player, ctx) {
    if (!ctx.game._hasReinforcementsAvailable(player.name, 'mech')) {
      return
    }

    const controlledPlanets = player.getControlledPlanets()
    if (controlledPlanets.length === 0) {
      return
    }

    const choice = ctx.actions.choose(player, [
      ctx.actions.option({ id: 'deploy', title: 'Deploy Eidolon' }),
      ctx.actions.option({ id: 'pass', title: 'Pass' }),
    ], {
      title: 'Eidolon DEPLOY: Place 1 mech on a planet you control?',
    })

    const edPick = choice[0]
    const edPickId = (edPick && typeof edPick === 'object') ? edPick.id : edPick
    if (edPickId !== 'deploy' && edPick !== 'Deploy Eidolon') {
      return
    }

    let targetPlanet
    if (controlledPlanets.length === 1) {
      targetPlanet = controlledPlanets[0]
    }
    else {
      const sel = ctx.actions.choose(
        player,
        controlledPlanets.map(p => ctx.actions.option({ id: p, title: p, kind: 'planet' })),
        {
          title: 'Eidolon DEPLOY: Choose planet',
        },
      )
      const edpPick = sel[0]
      targetPlanet = (edpPick && typeof edpPick === 'object') ? edpPick.id : edpPick
    }

    const systemId = ctx.game._findSystemForPlanet(targetPlanet)
    if (systemId) {
      ctx.game._addUnitToPlanet(systemId, targetPlanet, 'mech', player.name)
      ctx.log.add({
        template: 'Eidolon DEPLOY: {player} places mech on {planet}',
        args: { player: player.name, planet: targetPlanet },
      })
    }
  },

  fabrication(ctx, player) {
    const fragments = player.relicFragments || []
    if (fragments.length === 0) {
      return
    }

    const choices = []
    const counts = {}
    for (const f of fragments) {
      counts[f] = (counts[f] || 0) + 1
    }
    const hasPair = Object.values(counts).some(c => c >= 2)

    if (hasPair) {
      choices.push(ctx.actions.option({ id: 'relic', title: 'Purge 2 fragments for relic' }))
    }
    choices.push(ctx.actions.option({ id: 'token', title: 'Purge 1 fragment for command token' }))

    const selection = ctx.actions.choose(player, choices, {
      title: 'Fabrication: Choose action',
    })

    const fabPick = selection[0]
    const fabPickId = (fabPick && typeof fabPick === 'object') ? fabPick.id : fabPick
    const fabPickTitle = (fabPick && typeof fabPick === 'object') ? fabPick.title : fabPick
    if (fabPickId === 'token' || fabPickTitle === 'Purge 1 fragment for command token') {
      const uniqueTypes = [...new Set(fragments)]
      let fragType
      if (uniqueTypes.length === 1) {
        fragType = uniqueTypes[0]
      }
      else {
        const fragSelection = ctx.actions.choose(
          player,
          uniqueTypes.map(t => ctx.actions.option({ id: t, title: t, kind: 'fragment' })),
          {
            title: 'Choose fragment type to purge',
          },
        )
        const ftPick = fragSelection[0]
        fragType = (ftPick && typeof ftPick === 'object') ? ftPick.id : ftPick
      }

      const idx = player.relicFragments.indexOf(fragType)
      if (idx !== -1) {
        player.relicFragments.splice(idx, 1)
      }

      player.commandTokens.tactics += 1

      ctx.log.add({
        template: '{player} purges 1 {type} fragment for 1 command token (Fabrication)',
        args: { player, type: fragType },
      })
    }
    else if (fabPickId === 'relic' || fabPickTitle === 'Purge 2 fragments for relic') {
      const pairTypes = Object.entries(counts).filter(([, c]) => c >= 2).map(([t]) => t)
      let fragType
      if (pairTypes.length === 1) {
        fragType = pairTypes[0]
      }
      else {
        const fragSelection = ctx.actions.choose(
          player,
          pairTypes.map(t => ctx.actions.option({ id: t, title: t, kind: 'fragment' })),
          {
            title: 'Choose fragment type to purge (2)',
          },
        )
        const ft2Pick = fragSelection[0]
        fragType = (ft2Pick && typeof ft2Pick === 'object') ? ft2Pick.id : ft2Pick
      }

      for (let i = 0; i < 2; i++) {
        const idx = player.relicFragments.indexOf(fragType)
        if (idx !== -1) {
          player.relicFragments.splice(idx, 1)
        }
      }

      ctx.log.add({
        template: '{player} purges 2 {type} fragments for a relic (Fabrication)',
        args: { player, type: fragType },
      })

      ctx.game._gainRelic(player.name)
    }

    // Eidolon DEPLOY trigger: after using Fabrication, may place 1 mech
    this._offerEidolonDeploy(player, ctx)
  },

  // Hero — Hesh and Prit: PERFECT SYNTHESIS
  // Gain 1 relic and perform the secondary ability of up to 2 readied or unchosen
  // strategy cards; during this action, spend command tokens from your
  // reinforcements instead of your strategy pool. Then, purge this card.
  perfectSynthesis(ctx, player) {
    // 1. Gain 1 relic
    ctx.log.add({
      template: 'Perfect Synthesis: {player} gains 1 relic',
      args: { player: player.name },
    })

    ctx.game._gainRelic(player.name)

    // 2. Perform secondary of up to 2 strategy cards
    // Eligible: all strategy cards that are "readied" (picked but not used) by any player,
    // or "unchosen" (not picked by anyone)
    const allStrategyCards = ['leadership', 'diplomacy', 'politics', 'construction', 'trade', 'warfare', 'technology', 'imperial']

    // Find picked but unused strategy cards from all players
    const readiedCards = []
    for (const p of ctx.players.all()) {
      for (const sc of (p.strategyCards || [])) {
        if (!sc.used) {
          readiedCards.push(sc.id)
        }
      }
    }

    // Unchosen cards
    const unchosenCards = ctx.state.availableStrategyCards || []

    // Combine eligible cards (readied + unchosen), deduplicate
    const eligibleCards = [...new Set([...readiedCards, ...unchosenCards])]
      .filter(id => allStrategyCards.includes(id))

    let secondariesUsed = 0
    while (secondariesUsed < 2 && eligibleCards.length > 0) {
      const choices = [
        ...eligibleCards.map(id => ctx.actions.option({ id, title: id, kind: 'strategy-card' })),
        ctx.actions.option({ id: 'done', title: 'Done' }),
      ]
      const selection = ctx.actions.choose(player, choices, {
        title: `Perfect Synthesis: Choose strategy card secondary (${secondariesUsed}/2)`,
      })

      const psPick = selection[0]
      const psPickId = (psPick && typeof psPick === 'object') ? psPick.id : psPick
      const psPickTitle = (psPick && typeof psPick === 'object') ? psPick.title : psPick
      if (psPickId === 'done' || psPickTitle === 'Done') {
        break
      }

      const cardId = psPickId

      // Perform the secondary — tokens come from reinforcements instead of strategy pool
      // We simulate "free" secondary by not spending strategy token
      ctx.game._resolveSecondary(player, cardId)

      ctx.log.add({
        template: 'Perfect Synthesis: {player} performs {card} secondary',
        args: { player: player.name, card: cardId },
      })

      // Remove from eligible list so they can't pick the same card twice
      const idx = eligibleCards.indexOf(cardId)
      if (idx !== -1) {
        eligibleCards.splice(idx, 1)
      }
      secondariesUsed++
    }

    // Purge hero
    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Hesh and Prit',
      args: { player: player.name },
    })
  },

  // Absolute Synergy: When you have 4 mechs in the same system, you may return
  // 3 of those mechs to your reinforcements to flip this card onto your mech card.
  _checkAbsoluteSynergy(player, ctx) {
    if (!player.hasTechnology('absolute-synergy')) {
      return
    }
    if (ctx.state.absoluteSynergyFlipped?.[player.name]) {
      return
    }

    // Find any system with 4+ mechs
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      const allMechs = [
        ...(systemUnits.space || []),
        ...Object.values(systemUnits.planets || {}).flat(),
      ].filter(u => u.owner === player.name && u.type === 'mech')

      if (allMechs.length < 4) {
        continue
      }

      const choice = ctx.actions.choose(player, [
        ctx.actions.option({ id: 'flip', title: 'Flip Absolute Synergy' }),
        ctx.actions.option({ id: 'pass', title: 'Pass' }),
      ], {
        title: `Absolute Synergy: Return 3 mechs in system ${systemId} to flip this card?`,
      })

      const asPick = choice[0]
      const asPickId = (asPick && typeof asPick === 'object') ? asPick.id : asPick
      if (asPickId !== 'flip' && asPick !== 'Flip Absolute Synergy') {
        return
      }

      // Remove 3 mechs (prefer ground mechs first, then space)
      let removed = 0
      for (const planetId of Object.keys(systemUnits.planets || {})) {
        const planetUnits = systemUnits.planets[planetId]
        for (let i = planetUnits.length - 1; i >= 0 && removed < 3; i--) {
          if (planetUnits[i].owner === player.name && planetUnits[i].type === 'mech') {
            planetUnits.splice(i, 1)
            removed++
          }
        }
      }
      for (let i = (systemUnits.space || []).length - 1; i >= 0 && removed < 3; i--) {
        if (systemUnits.space[i].owner === player.name && systemUnits.space[i].type === 'mech') {
          systemUnits.space.splice(i, 1)
          removed++
        }
      }

      if (!ctx.state.absoluteSynergyFlipped) {
        ctx.state.absoluteSynergyFlipped = {}
      }
      ctx.state.absoluteSynergyFlipped[player.name] = true

      ctx.log.add({
        template: '{player} returns 3 mechs and flips Absolute Synergy',
        args: { player: player.name },
      })
      return
    }
  },

  // Agent — Garv and Gunn: At the end of a player's tactical action, exhaust
  // to allow that player to explore 1 planet they control in the active system.
  onTacticalActionEnd(naazRokhaPlayer, ctx, { activatingPlayer, systemId }) {
    // Check Absolute Synergy after any tactical action by this player
    if (activatingPlayer.name === naazRokhaPlayer.name) {
      this._checkAbsoluteSynergy(naazRokhaPlayer, ctx)
    }

    if (!naazRokhaPlayer.isAgentReady()) {
      return
    }

    // Find planets in the active system controlled by the activating player
    const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
    if (!tile || tile.planets.length === 0) {
      return
    }

    // Only consider unexplored planets with traits that the activating player controls
    const explorablePlanets = tile.planets.filter(planetId => {
      const planet = ctx.game.res.getPlanet(planetId)
      if (!planet || !planet.trait) {
        return false
      }
      if (ctx.state.exploredPlanets[planetId]) {
        return false
      }
      const planetState = ctx.state.planets[planetId]
      return planetState?.controller === activatingPlayer.name
    })

    if (explorablePlanets.length === 0) {
      return
    }

    const choice = ctx.actions.choose(naazRokhaPlayer, [
      ctx.actions.option({ id: 'exhaust', title: 'Exhaust Garv and Gunn' }),
      ctx.actions.option({ id: 'pass', title: 'Pass' }),
    ], {
      title: `Garv and Gunn: Exhaust to let ${activatingPlayer.name} explore a planet in the active system?`,
    })

    const ggPick = choice[0]
    const ggPickId = (ggPick && typeof ggPick === 'object') ? ggPick.id : ggPick
    if (ggPickId !== 'exhaust' && ggPick !== 'Exhaust Garv and Gunn') {
      return
    }

    naazRokhaPlayer.exhaustAgent()

    // Choose which planet to explore
    let targetPlanet
    if (explorablePlanets.length === 1) {
      targetPlanet = explorablePlanets[0]
    }
    else {
      const planetChoice = ctx.actions.choose(
        naazRokhaPlayer,
        explorablePlanets.map(p => ctx.actions.option({ id: p, title: p, kind: 'planet' })),
        {
          title: 'Garv and Gunn: Choose planet to explore',
        },
      )
      const ggpPick = planetChoice[0]
      targetPlanet = (ggpPick && typeof ggpPick === 'object') ? ggpPick.id : ggpPick
    }

    ctx.game._explorePlanet(targetPlanet, activatingPlayer.name)

    ctx.log.add({
      template: 'Garv and Gunn: {player} allows {target} to explore {planet}',
      args: { player: naazRokhaPlayer.name, target: activatingPlayer.name, planet: targetPlanet },
    })
  },

  // ---------------------------------------------------------------------------
  // Mech — Eidolon: Space Combat Flip
  // At start of space combat, if this mech is in the space area, flip to
  // Z-Grav Eidolon (also counts as a ship). At end of space combat, flip back.
  // ---------------------------------------------------------------------------

  onSpaceCombatStart(player, ctx, { systemId }) {
    // Also offer Supercharge at combat start (already handled by onSpaceCombatRound
    // for subsequent rounds, but start-of-combat Supercharge uses that hook)

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Find Naaz-Rokha mechs in the space area
    const mechsInSpace = systemUnits.space.filter(
      u => u.owner === player.name && u.type === 'mech'
    )

    if (mechsInSpace.length === 0) {
      return
    }

    // Flip each mech to Z-Grav Eidolon
    for (const mech of mechsInSpace) {
      mech._eidolonFlipped = true
    }

    ctx.log.add({
      template: '{player} flips {count} Eidolon mech(s) to Z-Grav Eidolon',
      args: { player: player.name, count: mechsInSpace.length },
    })
  },

  afterCombatResolved(player, ctx, { systemId, combatType }) {
    if (combatType !== 'space') {
      return
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    // Unflip any flipped mechs
    for (const unit of systemUnits.space) {
      if (unit.owner === player.name && unit.type === 'mech' && unit._eidolonFlipped) {
        delete unit._eidolonFlipped
      }
    }
  },
}
