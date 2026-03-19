const res = require('../../res/index.js')

module.exports = {
  onUnitDestroyed(player, ctx, { systemId: _systemId, unit }) {
    const unitDef = ctx.game.res.getUnit(unit.type)
    if (!unitDef || unitDef.category === 'structure') {
      return
    }

    // Devour only captures opponent's units, not your own
    if (unit.owner === player.name) {
      return
    }

    // Rule 17.6: cannot capture from players blockading your space docks
    if (ctx.game._isSpaceDockBlockadedBy(player.name, unit.owner)) {
      return
    }

    if (!ctx.state.capturedUnits[player.name]) {
      ctx.state.capturedUnits[player.name] = []
    }

    ctx.state.capturedUnits[player.name].push({
      type: unit.type,
      originalOwner: unit.owner,
    })

    ctx.log.add({
      template: '{player} captures {type} from {owner} (Devour)',
      args: { player, type: unit.type, owner: unit.owner },
    })
  },

  // ---------------------------------------------------------------------------
  // Agent — The Stillness of Stars: After another player replenishes
  // commodities, you may exhaust this card to convert that player's
  // commodities to trade goods and capture 1 of their units from reinforcements.
  // ---------------------------------------------------------------------------

  onCommoditiesReplenished(cabalPlayer, ctx, { replenishingPlayer }) {
    if (!cabalPlayer.isAgentReady()) {
      return
    }

    // Only triggers for other players
    if (replenishingPlayer.name === cabalPlayer.name) {
      return
    }

    const target = ctx.players.byName(replenishingPlayer.name)
    if (!target || target.commodities <= 0) {
      return
    }

    const choice = ctx.actions.choose(cabalPlayer, ['Exhaust Stillness of Stars', 'Pass'], {
      title: `Stillness of Stars: ${target.name} replenished ${target.commodities} commodities. Exhaust to convert and capture?`,
    })

    if (choice[0] !== 'Exhaust Stillness of Stars') {
      return
    }

    cabalPlayer.exhaustAgent()

    // Re-fetch target after agent exhaust (stale ref)
    const updatedTarget = ctx.players.byName(replenishingPlayer.name)
    const commodities = updatedTarget.commodities
    updatedTarget.addTradeGoods(commodities)
    updatedTarget.commodities = 0

    ctx.log.add({
      template: 'Stillness of Stars: {player} converts {count} commodities to trade goods for {target}',
      args: { player: cabalPlayer.name, count: commodities, target: updatedTarget.name },
    })

    // Rule 17.6: cannot capture from players blockading your space docks
    if (ctx.game._isSpaceDockBlockadedBy(cabalPlayer.name, updatedTarget.name)) {
      return
    }

    // Capture 1 unit from their reinforcements (choose unit type)
    const unitTypes = ['infantry', 'fighter', 'destroyer', 'cruiser', 'carrier', 'dreadnought']
    const captureChoice = ctx.actions.choose(cabalPlayer, unitTypes, {
      title: `Stillness of Stars: Capture 1 unit from ${updatedTarget.name}'s reinforcements`,
    })

    if (!ctx.state.capturedUnits[cabalPlayer.name]) {
      ctx.state.capturedUnits[cabalPlayer.name] = []
    }

    ctx.state.capturedUnits[cabalPlayer.name].push({
      type: captureChoice[0],
      originalOwner: updatedTarget.name,
    })

    ctx.log.add({
      template: 'Stillness of Stars: {player} captures {type} from {target} reinforcements',
      args: { player: cabalPlayer.name, type: captureChoice[0], target: updatedTarget.name },
    })
  },

  // ---------------------------------------------------------------------------
  // Mech — Reanimator: When a player's ground force on this planet is
  // destroyed, you may place 1 of their infantry from reinforcements on your
  // faction sheet (captured).
  // ---------------------------------------------------------------------------
  // This is handled via the onAnyUnitDestroyed hook — check if Cabal has a
  // mech on the same planet where an infantry was destroyed.

  onAnyUnitDestroyed(cabalPlayer, ctx, { systemId, unit, planetId, destroyerName: _destroyerName }) {
    // Only trigger for infantry on planets
    if (unit.type !== 'infantry' || !planetId || planetId === 'space') {
      return
    }

    // Don't capture own infantry
    if (unit.owner === cabalPlayer.name) {
      return
    }

    // Check if Cabal has a mech on the same planet
    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    const hasMech = planetUnits.some(
      u => u.owner === cabalPlayer.name && u.type === 'mech'
    )

    if (!hasMech) {
      return
    }

    // Rule 17.6: cannot capture from players blockading your space docks
    if (ctx.game._isSpaceDockBlockadedBy(cabalPlayer.name, unit.owner)) {
      return
    }

    if (!ctx.state.capturedUnits[cabalPlayer.name]) {
      ctx.state.capturedUnits[cabalPlayer.name] = []
    }

    ctx.state.capturedUnits[cabalPlayer.name].push({
      type: 'infantry',
      originalOwner: unit.owner,
    })

    ctx.log.add({
      template: 'Reanimator: {player} captures {owner} infantry from {planet}',
      args: { player: cabalPlayer.name, owner: unit.owner, planet: planetId },
    })
  },

  // Commander — That Which Molds Flesh: When producing fighter or infantry units,
  // up to 2 of those units do not count against your PRODUCTION limit.
  getProductionLimitBonus(player, _ctx, unitType) {
    if (!player.isCommanderUnlocked()) {
      return 0
    }
    if (unitType === 'fighter' || unitType === 'infantry') {
      return 2
    }
    return 0
  },

  componentActions: [
    {
      id: 'amalgamation',
      name: 'Amalgamation',
      abilityId: 'amalgamation',
      isAvailable(player) {
        return (this?._game?.state?.capturedUnits?.[player.name] || []).length > 0
      },
    },
    {
      id: 'riftmeld',
      name: 'Riftmeld',
      abilityId: 'riftmeld',
      isAvailable(player) {
        return (this?._game?.state?.capturedUnits?.[player.name] || []).length > 0
      },
    },
    {
      id: 'vortex',
      name: 'Vortex',
      abilityId: 'devour', // Use any Cabal ability ID
      isAvailable(player) {
        if (!player.hasTechnology('vortex')) {
          return false
        }
        // Check if Vortex tech is ready (not exhausted)
        const exhausted = player.exhaustedTechs || []
        return !exhausted.includes('vortex')
      },
    },
    {
      id: 'dimensional-anchor',
      name: 'It Feeds on Carrion',
      abilityId: 'devour',
      isAvailable(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  amalgamation(ctx, player) {
    const captured = ctx.state.capturedUnits[player.name] || []
    if (captured.length === 0) {
      return
    }

    const choices = captured.map(c => `${c.type} (from ${c.originalOwner})`)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Amalgamation: Choose captured unit to return',
    })

    const idx = choices.indexOf(selection[0])
    if (idx === -1) {
      return
    }

    const removed = captured.splice(idx, 1)[0]

    const validSystems = []
    for (const [sysId, sysUnits] of Object.entries(ctx.state.units)) {
      if (sysUnits.space.some(u => u.owner === player.name)) {
        validSystems.push(sysId)
      }
    }

    if (validSystems.length === 0) {
      return
    }

    let targetSystem
    if (validSystems.length === 1) {
      targetSystem = validSystems[0]
    }
    else {
      const sysSelection = ctx.actions.choose(player, validSystems, {
        title: 'Choose system to place unit',
      })
      targetSystem = sysSelection[0]
    }

    ctx.game._addUnit(targetSystem, 'space', removed.type, player.name)

    ctx.log.add({
      template: '{player} uses Amalgamation: places {type} in system {system}',
      args: { player, type: removed.type, system: targetSystem },
    })
  },

  riftmeld(ctx, player) {
    const captured = ctx.state.capturedUnits[player.name] || []
    if (captured.length === 0) {
      return
    }

    const choices = captured.map(c => `${c.type} (from ${c.originalOwner})`)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Riftmeld: Choose captured unit to return',
    })

    const idx = choices.indexOf(selection[0])
    if (idx === -1) {
      return
    }

    captured.splice(idx, 1)

    const allTechs = [...ctx.game.res.getGenericTechnologies()]
    if (player.faction?.factionTechnologies) {
      allTechs.push(...player.faction.factionTechnologies)
    }
    const unitUpgrades = allTechs
      .filter(t => t.unitUpgrade && !player.hasTechnology(t.id))
      .map(t => t.id)

    if (unitUpgrades.length === 0) {
      return
    }

    const techSelection = ctx.actions.choose(player, unitUpgrades, {
      title: 'Riftmeld: Research unit upgrade (ignoring prerequisites)',
    })

    const techId = techSelection[0]
    ctx.game._grantTechnology(player, techId)

    ctx.log.add({
      template: '{player} uses Riftmeld: researches {tech}',
      args: { player, tech: techId },
    })
  },

  // ---------------------------------------------------------------------------
  // Vortex — Faction Technology (Red, prerequisite: Red)
  // ---------------------------------------------------------------------------

  vortex(ctx, player) {
    // Exhaust the tech
    ctx.game._exhaustTech(player, 'vortex')

    // Find systems adjacent to any of the player's space docks
    const dockSystems = []
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      for (const planetId of Object.keys(systemUnits.planets)) {
        const planetUnits = systemUnits.planets[planetId] || []
        if (planetUnits.some(u => u.owner === player.name && u.type === 'space-dock')) {
          dockSystems.push(systemId)
          break
        }
      }
    }

    if (dockSystems.length === 0) {
      ctx.log.add({
        template: 'Vortex: {player} has no space docks',
        args: { player: player.name },
      })
      return
    }

    // Get all systems adjacent to dock systems
    const adjacentSystemIds = new Set()
    for (const dockSystem of dockSystems) {
      const adjacent = ctx.game._getAdjacentSystems(dockSystem)
      for (const adjId of adjacent) {
        adjacentSystemIds.add(adjId)
      }
      // Also include the dock system itself
      adjacentSystemIds.add(dockSystem)
    }

    // Find opponent non-structure units in those systems
    const targetableUnits = []
    for (const sysId of adjacentSystemIds) {
      const systemUnits = ctx.state.units[sysId]
      if (!systemUnits) {
        continue
      }

      // Check space units
      for (const unit of systemUnits.space) {
        if (unit.owner !== player.name) {
          const unitDef = res.getUnit(unit.type)
          if (unitDef && unitDef.category !== 'structure') {
            targetableUnits.push({
              type: unit.type,
              owner: unit.owner,
              systemId: sysId,
              location: 'space',
              cost: unitDef.cost || 0,
            })
          }
        }
      }

      // Check planet units
      for (const [planetId, planetUnits] of Object.entries(systemUnits.planets)) {
        for (const unit of planetUnits) {
          if (unit.owner !== player.name) {
            const unitDef = res.getUnit(unit.type)
            if (unitDef && unitDef.category !== 'structure') {
              targetableUnits.push({
                type: unit.type,
                owner: unit.owner,
                systemId: sysId,
                location: planetId,
                cost: unitDef.cost || 0,
              })
            }
          }
        }
      }
    }

    if (targetableUnits.length === 0) {
      ctx.log.add({
        template: 'Vortex: No opponent units in adjacent systems',
        args: {},
      })
      return
    }

    // De-duplicate by type + owner (we capture from reinforcements, not the board)
    const uniqueTargets = []
    const seen = new Set()
    for (const t of targetableUnits) {
      const key = `${t.type}:${t.owner}`
      if (!seen.has(key)) {
        seen.add(key)
        uniqueTargets.push(t)
      }
    }

    // Rule 17.6: filter out players blockading your space docks
    const nonBlockadedTargets = uniqueTargets.filter(
      t => !ctx.game._isSpaceDockBlockadedBy(player.name, t.owner)
    )

    if (nonBlockadedTargets.length === 0) {
      ctx.log.add({
        template: 'Vortex: All targets are blockading {player}',
        args: { player: player.name },
      })
      return
    }

    const choices = nonBlockadedTargets.map(t => `${t.type} from ${t.owner}`)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Vortex: Choose unit type to capture from reinforcements',
    })

    const idx = choices.indexOf(selection[0])
    if (idx === -1) {
      return
    }

    const target = nonBlockadedTargets[idx]

    // Capture 1 unit of that type from their reinforcements
    if (!ctx.state.capturedUnits[player.name]) {
      ctx.state.capturedUnits[player.name] = []
    }

    ctx.state.capturedUnits[player.name].push({
      type: target.type,
      originalOwner: target.owner,
    })

    ctx.log.add({
      template: 'Vortex: {player} captures {type} from {owner} reinforcements',
      args: { player: player.name, type: target.type, owner: target.owner },
    })
  },

  // ---------------------------------------------------------------------------
  // Hero — It Feeds on Carrion: DIMENSIONAL ANCHOR
  // ---------------------------------------------------------------------------

  dimensionalAnchor(ctx, player) {
    // Find all systems with dimensional tears (Cabal space docks)
    const tearSystems = new Set()
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      for (const planetId of Object.keys(systemUnits.planets)) {
        const planetUnits = systemUnits.planets[planetId] || []
        if (planetUnits.some(u => u.owner === player.name && u.type === 'space-dock')) {
          tearSystems.add(systemId)
          break
        }
      }
    }

    if (tearSystems.size === 0) {
      ctx.log.add({
        template: 'Dimensional Anchor: {player} has no dimensional tears (space docks)',
        args: { player: player.name },
      })
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges It Feeds on Carrion',
        args: { player: player.name },
      })
      return
    }

    // Get all systems in/adjacent to tear systems
    const affectedSystems = new Set()
    for (const tearSys of tearSystems) {
      affectedSystems.add(tearSys)
      const adjacent = ctx.game._getAdjacentSystems(tearSys)
      for (const adjId of adjacent) {
        affectedSystems.add(adjId)
      }
    }

    // For each other player, roll for each non-fighter ship
    let totalCaptured = 0
    const others = ctx.players.all().filter(p => p.name !== player.name)

    for (const otherPlayer of others) {
      const shipsToRollFor = []

      for (const sysId of affectedSystems) {
        const systemUnits = ctx.state.units[sysId]
        if (!systemUnits) {
          continue
        }

        // Check space units — non-fighter ships
        for (const unit of systemUnits.space) {
          if (unit.owner === otherPlayer.name && unit.type !== 'fighter') {
            const unitDef = res.getUnit(unit.type)
            if (unitDef && unitDef.category === 'ship') {
              shipsToRollFor.push({
                unit,
                systemId: sysId,
                location: 'space',
              })
            }
          }
        }
      }

      if (shipsToRollFor.length === 0) {
        continue
      }

      const capturedShips = []
      for (const { unit, systemId, location } of shipsToRollFor) {
        const roll = Math.floor(ctx.game.random() * 10) + 1
        if (roll <= 3) {
          // Capture this ship
          const arr = location === 'space'
            ? ctx.state.units[systemId].space
            : ctx.state.units[systemId].planets[location]

          const idx = arr.findIndex(u => u.id === unit.id)
          if (idx !== -1) {
            arr.splice(idx, 1)

            if (!ctx.state.capturedUnits[player.name]) {
              ctx.state.capturedUnits[player.name] = []
            }
            ctx.state.capturedUnits[player.name].push({
              type: unit.type,
              originalOwner: unit.owner,
            })

            capturedShips.push(unit)
            totalCaptured++
          }

          ctx.log.add({
            template: 'Dimensional Anchor: {owner} {type} captured (rolled {roll})',
            args: { owner: unit.owner, type: unit.type, roll },
          })
        }
        else {
          ctx.log.add({
            template: 'Dimensional Anchor: {owner} {type} survives (rolled {roll})',
            args: { owner: unit.owner, type: unit.type, roll },
          })
        }
      }

      // If capturing ships caused fighters/ground forces to be stranded,
      // check if the player still has capacity in each affected system
      // For simplicity, capture any now-unsupported fighters in affected systems
      for (const sysId of affectedSystems) {
        const systemUnits = ctx.state.units[sysId]
        if (!systemUnits) {
          continue
        }

        // Count remaining capacity for this player
        let totalCapacity = 0
        for (const unit of systemUnits.space) {
          if (unit.owner === otherPlayer.name) {
            const unitDef = ctx.game._getUnitStats(unit.owner, unit.type)
            if (unitDef && !unitDef.requiresCapacity && unitDef.category === 'ship') {
              totalCapacity += unitDef.capacity || 0
            }
          }
        }

        // Count units requiring capacity
        const capacityUnits = systemUnits.space.filter(
          u => u.owner === otherPlayer.name && u.type === 'fighter'
        )

        const excess = capacityUnits.length - totalCapacity
        if (excess > 0) {
          // Capture excess fighters
          for (let i = 0; i < excess; i++) {
            const fighterIdx = systemUnits.space.findIndex(
              u => u.owner === otherPlayer.name && u.type === 'fighter'
            )
            if (fighterIdx !== -1) {
              const fighter = systemUnits.space.splice(fighterIdx, 1)[0]
              ctx.state.capturedUnits[player.name].push({
                type: 'fighter',
                originalOwner: fighter.owner,
              })
              totalCaptured++

              ctx.log.add({
                template: 'Dimensional Anchor: {owner} fighter captured (no capacity)',
                args: { owner: fighter.owner },
              })
            }
          }
        }
      }
    }

    ctx.log.add({
      template: 'Dimensional Anchor: {player} captured {count} total units',
      args: { player: player.name, count: totalCaptured },
    })

    // Purge hero
    player.purgeHero()
    ctx.log.add({
      template: '{player} purges It Feeds on Carrion',
      args: { player: player.name },
    })
  },

  // ---------------------------------------------------------------------------
  // Dimensional Tear II — Space dock upgrade
  // ---------------------------------------------------------------------------
  // Production 7 (base is Production 5). Up to 12 fighters don't count against
  // capacity (base is 6). The unit upgrade is handled by the tech system.
  // The fighter capacity exemption is a passive effect that modifies capacity
  // calculation. We provide a helper method the engine can query.

  // ---------------------------------------------------------------------------
  // Al'Raith Ix Ianovar — Faction Technology
  // When researched: The Fracture enters play, ingress tokens placed on gravity
  // rift systems. Ships starting in The Fracture get +1 Move.
  // ---------------------------------------------------------------------------

  onTechResearched(player, ctx, tech) {
    if (tech.id !== 'alraith-ix-ianovar') {
      return
    }

    // Find gravity rift systems in the galaxy
    const gravityRiftSystems = []
    for (const [systemId, _systemData] of Object.entries(ctx.state.systems)) {
      const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
      if (tile && tile.anomaly === 'gravity-rift') {
        gravityRiftSystems.push(systemId)
      }
    }

    // Place The Fracture as a new system adjacent to gravity rifts
    const fractureId = 'the-fracture'
    ctx.state.systems[fractureId] = {
      tileId: fractureId,
      position: { q: -3, r: 0 },
      commandTokens: [],
      isFracture: true,
    }
    ctx.state.units[fractureId] = { space: [], planets: {} }

    ctx.state.theFracture = {
      owner: player.name,
      systemId: fractureId,
      ingressTokens: [],
    }

    ctx.log.add({
      template: "Al'Raith Ix Ianovar: {player} causes The Fracture to enter play",
      args: { player: player.name },
    })

    // Place up to 2 ingress tokens on gravity rift systems
    const tokensToPlace = Math.min(2, gravityRiftSystems.length)
    for (let i = 0; i < tokensToPlace; i++) {
      const remaining = gravityRiftSystems.filter(
        s => !ctx.state.theFracture.ingressTokens.includes(s)
      )
      if (remaining.length === 0) {
        break
      }

      let targetSystem
      if (remaining.length === 1) {
        targetSystem = remaining[0]
      }
      else {
        const sel = ctx.actions.choose(player, remaining, {
          title: `Place ingress token ${i + 1}/${tokensToPlace} on a gravity rift`,
        })
        targetSystem = sel[0]
      }

      ctx.state.theFracture.ingressTokens.push(targetSystem)

      ctx.log.add({
        template: "Al'Raith: {player} places ingress token in system {system}",
        args: { player: player.name, system: targetSystem },
      })
    }
  },

  getMovementBonus(player, ctx, fromSystemId) {
    if (!player.hasTechnology('alraith-ix-ianovar')) {
      return 0
    }
    // +1 Move for ships starting in The Fracture
    if (ctx.state.theFracture && String(fromSystemId) === ctx.state.theFracture.systemId) {
      return 1
    }
    return 0
  },

  /**
   * Returns the number of fighters that don't count against capacity in a system
   * with this player's space dock. Returns 6 for base, 12 for Dimensional Tear II.
   */
  getFighterCapacityExemption(player, _ctx) {
    if (player.hasTechnology('dimensional-tear-ii')) {
      return 12
    }
    return 6
  },
}
