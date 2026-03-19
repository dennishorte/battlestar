module.exports = {
  componentActions: [
    {
      id: 'creuss-hero',
      name: 'Riftwalker Meian',
      abilityId: 'quantum-entanglement',  // reuse faction ability ID for availability gate
      isAvailable: function(player) {
        return player.isHeroUnlocked() && !player.isHeroPurged()
      },
    },
  ],

  getHomeSystemWormholes(player, ctx, systemId) {
    if (String(systemId) === String(player.faction?.homeSystem)) {
      return ['alpha', 'beta']
    }
    return []
  },

  getMovementBonus(player, ctx, fromSystemId) {
    const tile = ctx.game.res.getSystemTile(fromSystemId) ||
      ctx.game.res.getSystemTile(Number(fromSystemId))
    const wormholes = tile ? [...tile.wormholes] : []

    // Also check faction wormholes (from getHomeSystemWormholes dispatcher)
    const factionWormholes = ctx.getHomeSystemWormholes(fromSystemId)
    for (const w of factionWormholes) {
      if (!wormholes.includes(w)) {
        wormholes.push(w)
      }
    }

    if (wormholes.includes('alpha') || wormholes.includes('beta')) {
      return 1
    }
    return 0
  },

  // Agent — Emissary Taivra: After a player activates a system that contains a
  // non-delta wormhole, exhaust to make that system adjacent to all other systems
  // that contain a wormhole during this tactical action.
  onAnySystemActivated(creussPlayer, ctx, { systemId, activatingPlayer: _activatingPlayer }) {
    // Agent — Emissary Taivra
    if (creussPlayer.isAgentReady()) {
      // Check if the activated system contains a non-delta wormhole
      const tile = ctx.game.res.getSystemTile(systemId) ||
        ctx.game.res.getSystemTile(Number(systemId))
      const wormholes = tile ? [...tile.wormholes] : []

      // Also check faction wormholes
      const factionWormholes = ctx.getHomeSystemWormholes(systemId)
      for (const w of factionWormholes) {
        if (!wormholes.includes(w)) {
          wormholes.push(w)
        }
      }

      // Filter to non-delta wormholes
      const nonDeltaWormholes = wormholes.filter(w => w !== 'delta')
      if (nonDeltaWormholes.length > 0) {
        const choice = ctx.actions.choose(creussPlayer, ['Exhaust Emissary Taivra', 'Pass'], {
          title: `Emissary Taivra: Make system ${systemId} adjacent to all wormhole systems?`,
        })

        if (choice[0] === 'Exhaust Emissary Taivra') {
          creussPlayer.exhaustAgent()

          // Find all systems with wormholes
          const wormholeSystems = []
          for (const [sysId, _sysData] of Object.entries(ctx.state.systems)) {
            if (String(sysId) === String(systemId)) {
              continue
            }
            const sysTile = ctx.game.res.getSystemTile(sysId) ||
              ctx.game.res.getSystemTile(Number(sysId))
            const sysWormholes = sysTile ? [...sysTile.wormholes] : []
            const sysFactionWormholes = ctx.getHomeSystemWormholes(sysId)
            for (const w of sysFactionWormholes) {
              if (!sysWormholes.includes(w)) {
                sysWormholes.push(w)
              }
            }
            if (sysWormholes.length > 0) {
              wormholeSystems.push(String(sysId))
            }
          }

          if (wormholeSystems.length > 0) {
            if (!ctx.state.temporaryAdjacency) {
              ctx.state.temporaryAdjacency = []
            }
            ctx.state.temporaryAdjacency.push({
              systemId: String(systemId),
              adjacentTo: wormholeSystems,
            })

            ctx.log.add({
              template: 'Emissary Taivra: {player} makes system {system} adjacent to {count} wormhole systems',
              args: { player: creussPlayer.name, system: systemId, count: wormholeSystems.length },
            })
          }
        }
      }
    }

    // Icarus Drive mech: after any system activation, may remove mech to
    // place or move Creuss wormhole token into that system
    this._offerIcarusDrive(creussPlayer, ctx, systemId)
  },

  _offerIcarusDrive(creussPlayer, ctx, systemId) {
    // Find all mechs the Creuss player has on any planet
    const mechLocations = []
    for (const [sysId, sysUnits] of Object.entries(ctx.state.units)) {
      for (const [planetId, planetUnits] of Object.entries(sysUnits.planets)) {
        for (const unit of planetUnits) {
          if (unit.owner === creussPlayer.name && unit.type === 'mech') {
            mechLocations.push({ systemId: sysId, planetId })
          }
        }
      }
    }

    if (mechLocations.length === 0) {
      return
    }

    const choice = ctx.actions.choose(creussPlayer, ['Remove Mech (Icarus Drive)', 'Pass'], {
      title: `Icarus Drive: Remove a mech to place Creuss wormhole token in system ${systemId}?`,
    })

    if (choice[0] !== 'Remove Mech (Icarus Drive)') {
      return
    }

    // Choose which mech to remove if more than one
    let target
    if (mechLocations.length === 1) {
      target = mechLocations[0]
    }
    else {
      const mechChoices = mechLocations.map(m => `${m.planetId} (system ${m.systemId})`)
      const mechSel = ctx.actions.choose(creussPlayer, mechChoices, {
        title: 'Icarus Drive: Which mech to remove?',
      })
      target = mechLocations[mechChoices.indexOf(mechSel[0])]
    }

    // Remove the mech from the planet
    const planetUnits = ctx.state.units[target.systemId].planets[target.planetId]
    const mechIdx = planetUnits.findIndex(u => u.owner === creussPlayer.name && u.type === 'mech')
    if (mechIdx !== -1) {
      planetUnits.splice(mechIdx, 1)
    }

    // Place or move Creuss wormhole token into the activated system
    ctx.state.creussWormholeToken = String(systemId)

    ctx.log.add({
      template: 'Icarus Drive: {player} removes mech from {planet} and places Creuss wormhole token in system {system}',
      args: { player: creussPlayer.name, planet: target.planetId, system: systemId },
    })
  },

  // Dimensional Splicer (faction tech): At the start of space combat in a
  // system that contains a wormhole and 1 or more of your ships, produce 1 hit
  // and assign it to 1 of your opponent's ships.
  onSpaceCombatStart(player, ctx, { systemId, opponentName }) {
    if (!player.hasTechnology('dimensional-splicer')) {
      return
    }

    // Check this player has ships in the system
    const systemUnits = ctx.state.units[systemId]
    const ownShips = systemUnits.space.filter(u => u.owner === player.name)
    if (ownShips.length === 0) {
      return
    }

    // Check if the system contains a wormhole (tile wormholes + faction wormholes)
    const tile = ctx.game.res.getSystemTile(systemId) ||
      ctx.game.res.getSystemTile(Number(systemId))
    const wormholes = tile ? [...tile.wormholes] : []
    const factionWormholes = ctx.getHomeSystemWormholes(systemId)
    for (const w of factionWormholes) {
      if (!wormholes.includes(w)) {
        wormholes.push(w)
      }
    }

    if (wormholes.length === 0) {
      return
    }

    ctx.log.add({
      template: '{player} Dimensional Splicer produces 1 hit',
      args: { player: player.name },
    })

    ctx.game._assignHits(systemId, opponentName, 1, player.name)
  },

  // ---------------------------------------------------------------------------
  // Hero — Riftwalker Meian: SINGULARITY REACTOR
  // ACTION: Swap the positions of any 2 systems that contain wormholes or
  // your units, other than the Creuss system and the Wormhole Nexus.
  // Then, purge this card.
  // ---------------------------------------------------------------------------

  creussHero(ctx, player) {
    const res = ctx.game.res

    // Find eligible systems: contain wormholes or Creuss units
    // Exclude creuss-home and wormhole-nexus
    const eligibleSystems = []
    for (const [systemId, _systemData] of Object.entries(ctx.state.systems)) {
      if (systemId === 'creuss-home' || systemId === 'wormhole-nexus') {
        continue
      }

      const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
      const wormholes = tile ? [...tile.wormholes] : []

      // Check faction wormholes
      const factionWormholes = ctx.getHomeSystemWormholes(systemId)
      for (const w of factionWormholes) {
        if (!wormholes.includes(w)) {
          wormholes.push(w)
        }
      }

      // Check if Creuss wormhole token is in this system
      if (ctx.state.creussWormholeToken === systemId) {
        wormholes.push('creuss')
      }

      const hasWormhole = wormholes.length > 0

      // Check if Creuss player has units in the system
      const systemUnits = ctx.state.units[systemId]
      let hasOwnUnits = false
      if (systemUnits) {
        hasOwnUnits = systemUnits.space.some(u => u.owner === player.name)
        if (!hasOwnUnits && systemUnits.planets) {
          for (const planetUnits of Object.values(systemUnits.planets)) {
            if (planetUnits.some(u => u.owner === player.name)) {
              hasOwnUnits = true
              break
            }
          }
        }
      }

      if (hasWormhole || hasOwnUnits) {
        eligibleSystems.push(systemId)
      }
    }

    if (eligibleSystems.length < 2) {
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Riftwalker Meian but fewer than 2 eligible systems',
        args: { player: player.name },
      })
      return
    }

    // Choose first system
    const first = ctx.actions.choose(player, eligibleSystems, {
      title: 'Singularity Reactor: Choose first system to swap',
    })
    const firstSystem = first[0]

    // Choose second system (cannot be the same)
    const secondOptions = eligibleSystems.filter(s => s !== firstSystem)
    const second = ctx.actions.choose(player, secondOptions, {
      title: 'Singularity Reactor: Choose second system to swap',
    })
    const secondSystem = second[0]

    // Swap positions
    const pos1 = ctx.state.systems[firstSystem].position
    const pos2 = ctx.state.systems[secondSystem].position
    ctx.state.systems[firstSystem].position = { ...pos2 }
    ctx.state.systems[secondSystem].position = { ...pos1 }

    ctx.log.add({
      template: 'Singularity Reactor: {player} swaps systems {sys1} and {sys2}',
      args: { player: player.name, sys1: firstSystem, sys2: secondSystem },
    })

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Riftwalker Meian',
      args: { player: player.name },
    })
  },

  // ---------------------------------------------------------------------------
  // Commander — Sai Seravus: After your ships move, for each ship that has a
  // capacity value and moved through 1 or more wormholes, place 1 fighter
  // from reinforcements with that ship if you have unused capacity.
  // ---------------------------------------------------------------------------

  afterShipsMove(player, ctx, { systemId, movedShips }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    if (!movedShips || movedShips.length === 0) {
      return
    }

    const res = ctx.game.res

    // Check which ships moved through wormholes
    let fightersToPlace = 0
    for (const ship of movedShips) {
      if (ship.owner !== player.name) {
        continue
      }
      const unitDef = res.getUnit(ship.type) || ctx.game._getUnitStats(ship.owner, ship.type)
      if (!unitDef || !unitDef.capacity || unitDef.capacity <= 0) {
        continue
      }

      // Check if ship moved through a wormhole (via movedThroughWormhole flag)
      if (ship.movedThroughWormhole) {
        fightersToPlace++
      }
    }

    if (fightersToPlace === 0) {
      return
    }

    // Check remaining capacity in the active system
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }

    let totalCapacity = 0
    let totalCarried = 0
    for (const unit of systemUnits.space) {
      if (unit.owner === player.name) {
        const stats = ctx.game._getUnitStats(unit.owner, unit.type)
        if (stats?.capacity) {
          totalCapacity += stats.capacity
        }
        if (unit.type === 'fighter' || unit.type === 'infantry') {
          totalCarried++
        }
      }
    }

    const availableCapacity = totalCapacity - totalCarried
    const actualFighters = Math.min(fightersToPlace, availableCapacity)

    if (actualFighters <= 0) {
      return
    }

    for (let i = 0; i < actualFighters; i++) {
      ctx.game._addUnit(systemId, 'space', 'fighter', player.name)
    }

    ctx.log.add({
      template: 'Sai Seravus: {player} places {count} fighters in {system}',
      args: { player: player.name, count: actualFighters, system: systemId },
    })
  },
}
