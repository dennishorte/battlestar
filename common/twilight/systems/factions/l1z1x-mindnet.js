module.exports = {
  // ---------------------------------------------------------------------------
  // Assimilate: When you gain control of a planet, replace each PDS and space
  // dock on that planet with a matching unit from your reinforcements.
  // ---------------------------------------------------------------------------

  onPlanetGained(player, ctx, { planetId, systemId, structureCounts }) {
    let placed = false
    for (const [unitType, count] of Object.entries(structureCounts)) {
      if (unitType === 'pds' || unitType === 'space-dock') {
        for (let i = 0; i < count; i++) {
          ctx.game._addUnitToPlanet(systemId, planetId, unitType, player.name)
          placed = true
        }
      }
    }

    if (placed) {
      ctx.log.add({
        template: '{player} assimilates structures on {planet}',
        args: { player, planet: planetId },
      })
    }
  },

  // ---------------------------------------------------------------------------
  // Harrow: At the end of each round of ground combat, your ships in the
  // active system may use their BOMBARDMENT abilities against your opponent's
  // ground forces on the planet.
  //
  // Commander (2RAM): Each of your dreadnoughts and war suns that are in or
  // adjacent to the active system may participate in ground combat as if they
  // were ground forces. They are not considered ground forces for the purposes
  // of other game effects.
  // ---------------------------------------------------------------------------

  onGroundCombatRoundEnd(player, ctx, { systemId, planetId, opponentName }) {
    // --- Harrow: bombardment from ships in the active system ---
    this._harrowBombardment(player, ctx, systemId, planetId, opponentName)

    // --- Commander (2RAM): dreadnoughts/war suns roll combat dice ---
    if (player.isCommanderUnlocked()) {
      this._commanderGroundCombat(player, ctx, systemId, planetId, opponentName)
    }
  },

  // Harrow: ships with bombardment abilities fire at ground forces each round
  _harrowBombardment(player, ctx, systemId, planetId, opponentName) {
    const systemUnits = ctx.state.units[systemId]
    const bombardShips = systemUnits.space.filter(u => {
      if (u.owner !== player.name || u.type === 'fighter') {
        return false
      }
      const stats = ctx.game._getUnitStats(u.owner, u.type)
      return stats?.abilities?.some(a => a.startsWith('bombardment-'))
    })

    if (bombardShips.length === 0) {
      return
    }

    let totalHits = 0
    for (const ship of bombardShips) {
      const stats = ctx.game._getUnitStats(ship.owner, ship.type)
      const bombAbility = stats.abilities.find(a => a.startsWith('bombardment-'))
      if (!bombAbility) {
        continue
      }
      const parts = bombAbility.replace('bombardment-', '').split('x')
      const combatValue = parseInt(parts[0])
      const diceCount = parseInt(parts[1])
      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(ctx.game.random() * 10) + 1
        if (roll >= combatValue) {
          totalHits++
        }
      }
    }

    if (totalHits > 0) {
      ctx.log.add({
        template: '{player} Harrow bombardment: {hits} hits on {planet}',
        args: { player, hits: totalHits, planet: planetId },
      })
      ctx.game._assignGroundHits(systemId, planetId, opponentName, totalHits, player.name)
    }
  },

  // Commander (2RAM): dreadnoughts and war suns participate in ground combat
  // as if they were ground forces (rolling combat dice, not bombardment).
  // Includes ships in the active system AND adjacent systems.
  _commanderGroundCombat(player, ctx, systemId, planetId, opponentName) {
    const eligibleShips = this._getCommanderEligibleShips(player, ctx, systemId)

    if (eligibleShips.length === 0) {
      return
    }

    // Roll combat dice for each eligible ship (using combat values)
    let totalHits = 0
    for (const ship of eligibleShips) {
      const stats = ctx.game._getUnitStats(ship.owner, ship.type)
      if (!stats || !stats.combat) {
        continue
      }

      // War suns roll 3 dice, others roll 1
      const diceCount = stats.type === 'war-sun' ? 3 : 1
      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(ctx.game.random() * 10) + 1
        if (roll >= stats.combat) {
          totalHits++
        }
      }
    }

    if (totalHits > 0) {
      ctx.log.add({
        template: '2RAM: {player} dreadnoughts/war suns score {hits} ground combat hits on {planet}',
        args: { player, hits: totalHits, planet: planetId },
      })
      ctx.game._assignGroundHits(systemId, planetId, opponentName, totalHits, player.name)
    }
  },

  // Collect dreadnoughts and war suns in the active system and adjacent systems
  _getCommanderEligibleShips(player, ctx, systemId) {
    const eligible = []

    // Ships in the active system
    const systemUnits = ctx.state.units[systemId]
    if (systemUnits) {
      for (const ship of systemUnits.space) {
        if (ship.owner === player.name && (ship.type === 'dreadnought' || ship.type === 'war-sun')) {
          eligible.push(ship)
        }
      }
    }

    // Ships in adjacent systems
    const adjacentIds = ctx.game._getAdjacentSystems(systemId)
    for (const adjId of adjacentIds) {
      const adjUnits = ctx.state.units[adjId]
      if (!adjUnits) {
        continue
      }
      for (const ship of adjUnits.space) {
        if (ship.owner === player.name && (ship.type === 'dreadnought' || ship.type === 'war-sun')) {
          eligible.push(ship)
        }
      }
    }

    return eligible
  },
}
