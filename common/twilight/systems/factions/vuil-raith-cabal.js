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

    const choices = uniqueTargets.map(t => `${t.type} from ${t.owner}`)
    const selection = ctx.actions.choose(player, choices, {
      title: 'Vortex: Choose unit type to capture from reinforcements',
    })

    const idx = choices.indexOf(selection[0])
    if (idx === -1) {
      return
    }

    const target = uniqueTargets[idx]

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
