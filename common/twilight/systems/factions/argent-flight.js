const { getUnit } = require('../../res/units.js')

module.exports = {
  votesFirst: true,

  getVotingModifier(player, ctx) {
    return ctx.players.all().length
  },

  getRaidFormationExcessHits(player, ctx, totalHits, fightersDestroyed) {
    return Math.max(0, totalHits - fightersDestroyed)
  },

  // Aerie Hololattice: other players cannot move ships through systems with
  // Argent structures.
  isStructureBlocking(player, ctx, { systemId, moverName: _moverName }) {
    if (!player.hasTechnology('aerie-hololattice')) {
      return false
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return false
    }

    // Check planets for structures (PDS, space-dock) owned by the Argent player
    for (const planetUnits of Object.values(systemUnits.planets)) {
      for (const unit of planetUnits) {
        if (unit.owner !== player.name) {
          continue
        }
        const def = getUnit(unit.type)
        if (def?.category === 'structure') {
          return true
        }
      }
    }

    return false
  },

  // Aerie Hololattice: each planet with structures gains PRODUCTION 1
  getStructureProductionBonus(player, ctx, systemId) {
    if (!player.hasTechnology('aerie-hololattice')) {
      return 0
    }

    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return 0
    }

    let bonus = 0
    const tile = ctx.game.res.getSystemTile(systemId) || ctx.game.res.getSystemTile(Number(systemId))
    if (!tile) {
      return 0
    }

    for (const planetId of tile.planets) {
      const planetUnits = systemUnits.planets[planetId] || []
      const hasStructure = planetUnits.some(u => {
        if (u.owner !== player.name) {
          return false
        }
        const def = getUnit(u.type)
        return def?.category === 'structure'
      })
      if (hasStructure) {
        // Each planet with structures gains PRODUCTION 1 — but not for planets
        // that already have a space dock (they already have production).
        // The ability adds PRODUCTION 1 to structures that don't normally produce.
        const hasSpaceDock = planetUnits.some(
          u => u.owner === player.name && u.type === 'space-dock'
        )
        if (!hasSpaceDock) {
          bonus += 1
        }
      }
    }

    return bonus
  },

  // Mech — Aerie Sentinel: does not count against capacity when being transported
  // or in a space area with ships that have capacity.
  isCapacityExempt(player, _ctx, unitType) {
    return unitType === 'mech'
  },

  // Agent — Trillossa Aun Mirik: After a player activates a system, exhaust to
  // place 1 infantry from reinforcements on a planet in that system or adjacent
  // systems that the Argent player controls.
  onAnySystemActivated(argentPlayer, ctx, { systemId, activatingPlayer: _activatingPlayer }) {
    if (!argentPlayer.isAgentReady()) {
      return
    }

    // Gather planets the Argent player controls in the activated system and
    // adjacent systems
    const eligiblePlanets = []

    const systemIds = [systemId, ...ctx.game._getAdjacentSystems(systemId)]
    for (const sysId of systemIds) {
      const tile = ctx.game.res.getSystemTile(sysId) || ctx.game.res.getSystemTile(Number(sysId))
      if (!tile || tile.planets.length === 0) {
        continue
      }
      for (const planetId of tile.planets) {
        const planetState = ctx.state.planets[planetId]
        if (planetState && planetState.controller === argentPlayer.name) {
          eligiblePlanets.push({ planetId, systemId: sysId })
        }
      }
    }

    if (eligiblePlanets.length === 0) {
      return
    }

    const choice = ctx.actions.choose(argentPlayer, ['Exhaust Trillossa Aun Mirik', 'Pass'], {
      title: 'Trillossa Aun Mirik: Exhaust to place 1 infantry on a planet you control?',
    })

    if (choice[0] !== 'Exhaust Trillossa Aun Mirik') {
      return
    }

    argentPlayer.exhaustAgent()

    // Choose which planet to place infantry on
    let target
    if (eligiblePlanets.length === 1) {
      target = eligiblePlanets[0]
    }
    else {
      const planetChoices = eligiblePlanets.map(p => p.planetId)
      const planetChoice = ctx.actions.choose(argentPlayer, planetChoices, {
        title: 'Trillossa Aun Mirik: Choose planet for 1 infantry',
      })
      target = eligiblePlanets.find(p => p.planetId === planetChoice[0])
    }

    ctx.game._addUnit(target.systemId, target.planetId, 'infantry', argentPlayer.name)

    ctx.log.add({
      template: 'Trillossa Aun Mirik: {player} places 1 infantry on {planet}',
      args: { player: argentPlayer.name, planet: target.planetId },
    })
  },

  // Commander — Trrakan Aun Zulok: When 1 or more of your units make a roll
  // for a unit ability (AFB, space cannon, bombardment), you may choose 1 of
  // those units to roll 1 additional die.
  getUnitAbilityBonusDice(player, _ctx) {
    if (!player.isCommanderUnlocked()) {
      return 0
    }
    return 1
  },

  commanderEffect: {
    timing: 'unit-ability-bonus-dice',
    apply: (_player, _context) => {
      return 1 // +1 die to one unit's ability roll
    },
  },

  // Wing Transfer — Part 1: Token Placement
  // When you activate a system that contains only your units, you may place
  // command tokens from your reinforcements into adjacent systems with only your units.
  onSystemActivated(player, ctx, systemId) {
    if (!player.hasTechnology('wing-transfer')) {
      return
    }

    // Check if activated system contains only this player's units
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return
    }
    if (systemUnits.space.some(u => u.owner !== player.name)) {
      return
    }
    for (const planetUnits of Object.values(systemUnits.planets)) {
      if (planetUnits.some(u => u.owner !== player.name)) {
        return
      }
    }

    if (player.commandTokens.tactics <= 0) {
      return
    }

    // Find adjacent systems with only this player's units and no existing token
    const adjacentSystems = ctx.game._getAdjacentSystems(systemId)
    const eligibleTargets = adjacentSystems.filter(adjId => {
      const adjUnits = ctx.state.units[adjId]
      if (!adjUnits) {
        return false
      }
      // Must have some units belonging to this player
      const hasOwnUnits = adjUnits.space.some(u => u.owner === player.name)
        || Object.values(adjUnits.planets).some(pu => pu.some(u => u.owner === player.name))
      if (!hasOwnUnits) {
        return false
      }
      // Must not have enemy units
      if (adjUnits.space.some(u => u.owner !== player.name)) {
        return false
      }
      for (const pu of Object.values(adjUnits.planets)) {
        if (pu.some(u => u.owner !== player.name)) {
          return false
        }
      }
      // Must not already have a command token from this player
      if (ctx.state.systems[adjId]?.commandTokens?.includes(player.name)) {
        return false
      }
      return true
    })

    if (eligibleTargets.length === 0) {
      return
    }

    const choice = ctx.actions.choose(player, ['Place Tokens (Wing Transfer)', 'Pass'], {
      title: 'Wing Transfer: Place command tokens in adjacent systems with only your units?',
    })

    if (choice[0] !== 'Place Tokens (Wing Transfer)') {
      return
    }

    for (const targetId of eligibleTargets) {
      if (player.commandTokens.tactics <= 0) {
        break
      }
      player.commandTokens.tactics -= 1
      ctx.state.systems[targetId].commandTokens.push(player.name)
      ctx.log.add({
        template: 'Wing Transfer: {player} places command token in system {system}',
        args: { player: player.name, system: targetId },
      })
    }
  },

  // Wing Transfer — Part 2: Ship Redistribution
  // At the end of this tactical action, you may move ships among the active system
  // and systems adjacent to it that contain your command tokens.
  onTacticalActionEnd(player, ctx, { activatingPlayer, systemId }) {
    if (activatingPlayer.name !== player.name) {
      return
    }
    if (!player.hasTechnology('wing-transfer')) {
      return
    }

    // Find adjacent systems with this player's command tokens
    const adjacentSystems = ctx.game._getAdjacentSystems(systemId)
    const tokenSystems = adjacentSystems.filter(adjId => {
      return ctx.state.systems[adjId]?.commandTokens?.includes(player.name)
    })

    if (tokenSystems.length === 0) {
      return
    }

    // All eligible systems for redistribution
    const allSystems = [systemId, ...tokenSystems]

    // Check if there are ships to redistribute
    let hasShips = false
    for (const sysId of allSystems) {
      const sysUnits = ctx.state.units[sysId]
      if (sysUnits && sysUnits.space.some(u => u.owner === player.name)) {
        hasShips = true
        break
      }
    }
    if (!hasShips) {
      return
    }

    const choice = ctx.actions.choose(player, ['Redistribute Ships (Wing Transfer)', 'Pass'], {
      title: 'Wing Transfer: Move ships among active system and adjacent systems with your tokens?',
    })

    if (choice[0] !== 'Redistribute Ships (Wing Transfer)') {
      return
    }

    // For each system with ships, offer to move some
    for (const sourceId of allSystems) {
      const sourceUnits = ctx.state.units[sourceId]
      if (!sourceUnits) {
        continue
      }
      const ownShips = sourceUnits.space.filter(u => u.owner === player.name)
      if (ownShips.length === 0) {
        continue
      }

      const destSystems = allSystems.filter(id => id !== sourceId)
      if (destSystems.length === 0) {
        continue
      }

      const shipCounts = {}
      for (const ship of ownShips) {
        shipCounts[ship.type] = (shipCounts[ship.type] || 0) + 1
      }

      const moveChoices = ['Skip']
      for (const [type, count] of Object.entries(shipCounts)) {
        for (let n = 1; n <= count; n++) {
          moveChoices.push(`Move ${n} ${type}`)
        }
      }

      const sel = ctx.actions.choose(player, moveChoices, {
        title: `Wing Transfer: Move ships from system ${sourceId}?`,
      })

      if (sel[0] === 'Skip') {
        continue
      }

      const match = sel[0].match(/^Move (\d+) (.+)$/)
      if (!match) {
        continue
      }
      const count = parseInt(match[1])
      const unitType = match[2]

      let destSystem
      if (destSystems.length === 1) {
        destSystem = destSystems[0]
      }
      else {
        const destChoice = ctx.actions.choose(player, destSystems, {
          title: `Wing Transfer: Move ${count} ${unitType} to which system?`,
        })
        destSystem = destChoice[0]
      }

      for (let i = 0; i < count; i++) {
        const idx = sourceUnits.space.findIndex(u => u.owner === player.name && u.type === unitType)
        if (idx !== -1) {
          const [ship] = sourceUnits.space.splice(idx, 1)
          if (!ctx.state.units[destSystem]) {
            ctx.state.units[destSystem] = { space: [], planets: {} }
          }
          ctx.state.units[destSystem].space.push(ship)
        }
      }

      ctx.log.add({
        template: 'Wing Transfer: {player} moves {count} {type} from system {from} to system {to}',
        args: { player: player.name, count, type: unitType, from: sourceId, to: destSystem },
      })
    }
  },

  // Hero — Mirik Aun Sissiri: HELIX PROTOCOL
  // Move any number of your ships from any systems to any number of other
  // systems that contain 1 of your command tokens and no other players' ships.
  // Then, purge this card.
  componentActions: [
    {
      id: 'helix-protocol',
      name: 'Mirik Aun Sissiri (Helix Protocol)',
      abilityId: 'raid-formation', // Argent players have this ability
      isAvailable: (player) => player.isHeroUnlocked() && !player.isHeroPurged(),
    },
  ],

  helixProtocol(ctx, player) {
    // Find all systems that contain the player's command tokens and no enemy ships
    const targetSystems = []
    for (const [systemId, systemData] of Object.entries(ctx.state.systems)) {
      if (!systemData.commandTokens || !systemData.commandTokens.includes(player.name)) {
        continue
      }
      const systemUnits = ctx.state.units[systemId]
      if (!systemUnits) {
        continue
      }
      // No other players' ships allowed
      const hasEnemyShips = systemUnits.space.some(u => u.owner !== player.name)
      if (hasEnemyShips) {
        continue
      }
      targetSystems.push(systemId)
    }

    if (targetSystems.length === 0) {
      ctx.log.add({
        template: '{player} activates Helix Protocol but has no valid target systems',
        args: { player: player.name },
      })
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Mirik Aun Sissiri',
        args: { player: player.name },
      })
      return
    }

    // Find all systems that have the player's ships
    const sourceSystems = []
    for (const [systemId, systemUnits] of Object.entries(ctx.state.units)) {
      const ownShips = systemUnits.space.filter(u => u.owner === player.name)
      if (ownShips.length > 0) {
        sourceSystems.push(systemId)
      }
    }

    if (sourceSystems.length === 0) {
      ctx.log.add({
        template: '{player} activates Helix Protocol but has no ships to move',
        args: { player: player.name },
      })
      player.purgeHero()
      ctx.log.add({
        template: '{player} purges Mirik Aun Sissiri',
        args: { player: player.name },
      })
      return
    }

    // Build a list of movable ships across all source systems
    let movedAny = false
    for (const sourceSystem of sourceSystems) {
      const systemUnits = ctx.state.units[sourceSystem]
      const ownShips = systemUnits.space.filter(u => u.owner === player.name)
      if (ownShips.length === 0) {
        continue
      }

      // Group ships by type for choices
      const shipCounts = {}
      for (const ship of ownShips) {
        shipCounts[ship.type] = (shipCounts[ship.type] || 0) + 1
      }

      // For each source system, ask what to move (or skip)
      const moveChoices = ['Skip this system']
      for (const [type, count] of Object.entries(shipCounts)) {
        for (let n = 1; n <= count; n++) {
          moveChoices.push(`Move ${n} ${type} from ${sourceSystem}`)
        }
      }

      const selection = ctx.actions.choose(player, moveChoices, {
        title: `Helix Protocol: Move ships from system ${sourceSystem}?`,
      })

      if (selection[0] === 'Skip this system') {
        continue
      }

      // Parse selection: "Move N type from systemId"
      const match = selection[0].match(/^Move (\d+) (.+) from (.+)$/)
      if (!match) {
        continue
      }
      const count = parseInt(match[1])
      const unitType = match[2]

      // Choose destination among target systems
      let destSystem
      if (targetSystems.length === 1) {
        destSystem = targetSystems[0]
      }
      else {
        const destChoice = ctx.actions.choose(player, targetSystems, {
          title: `Helix Protocol: Choose destination for ${count} ${unitType}`,
        })
        destSystem = destChoice[0]
      }

      // Move the ships
      let moved = 0
      for (let i = 0; i < count; i++) {
        const idx = systemUnits.space.findIndex(u => u.owner === player.name && u.type === unitType)
        if (idx !== -1) {
          const [ship] = systemUnits.space.splice(idx, 1)
          if (!ctx.state.units[destSystem]) {
            ctx.state.units[destSystem] = { space: [], planets: {} }
          }
          ctx.state.units[destSystem].space.push(ship)
          moved++
        }
      }

      if (moved > 0) {
        movedAny = true
        ctx.log.add({
          template: 'Helix Protocol: {player} moves {count} {type} from system {from} to system {to}',
          args: { player: player.name, count: moved, type: unitType, from: sourceSystem, to: destSystem },
        })
      }
    }

    if (!movedAny) {
      ctx.log.add({
        template: '{player} activates Helix Protocol but chose not to move any ships',
        args: { player: player.name },
      })
    }

    player.purgeHero()
    ctx.log.add({
      template: '{player} purges Mirik Aun Sissiri',
      args: { player: player.name },
    })
  },
}
