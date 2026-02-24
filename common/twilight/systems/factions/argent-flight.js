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
}
