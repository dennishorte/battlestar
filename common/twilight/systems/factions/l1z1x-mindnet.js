module.exports = {
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

  onGroundCombatRoundEnd(player, ctx, { systemId, planetId, opponentName }) {
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

    if (totalHits === 0) {
      return
    }

    const planetUnits = ctx.state.units[systemId].planets[planetId]
    let hits = totalHits
    while (hits > 0) {
      const idx = planetUnits.findIndex(u => u.owner === opponentName && u.type === 'infantry')
      if (idx === -1) {
        break
      }
      planetUnits.splice(idx, 1)
      hits--
    }

    ctx.log.add({
      template: '{player} Harrow bombardment: {hits} hits on {planet}',
      args: { player, hits: totalHits, planet: planetId },
    })
  },
}
