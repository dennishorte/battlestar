module.exports = {
  afterExploration(player, ctx, planetId) {
    if (ctx.state.sleeperTokens[planetId]) {
      return
    }

    const choices = ['Place sleeper', 'Pass']
    const selection = ctx.actions.choose(player, choices, {
      title: `Terragenesis: Place a sleeper token on ${planetId}?`,
    })

    if (selection[0] === 'Place sleeper') {
      ctx.state.sleeperTokens[planetId] = player.name

      ctx.log.add({
        template: '{player} places a sleeper token on {planet} (Terragenesis)',
        args: { player, planet: planetId },
      })
    }
  },

  onSystemActivated(player, ctx, systemId) {
    const tile = ctx.game.res.getSystemTile(systemId) ||
      ctx.game.res.getSystemTile(Number(systemId))
    if (!tile) {
      return
    }

    for (const planetId of tile.planets) {
      if (ctx.state.sleeperTokens[planetId] !== player.name) {
        continue
      }

      delete ctx.state.sleeperTokens[planetId]
      ctx.game._addUnitToPlanet(systemId, planetId, 'pds', player.name)

      ctx.log.add({
        template: '{player} awakens sleeper on {planet}: PDS deployed (Awaken)',
        args: { player, planet: planetId },
      })
    }
  },

  checkCoalescence(player, ctx, { systemId, moverName }) {
    const systemUnits = ctx.state.units[systemId]
    if (!systemUnits) {
      return false
    }

    for (const unit of systemUnits.space) {
      if (unit.owner === moverName) {
        continue
      }
      if (unit.owner === player.name && unit.type === 'flagship') {
        return true
      }
    }

    for (const [, planetUnits] of Object.entries(systemUnits.planets)) {
      for (const unit of planetUnits) {
        if (unit.owner === moverName) {
          continue
        }
        if (unit.owner === player.name && unit.type === 'mech') {
          return true
        }
      }
    }

    return false
  },

  // Agent — Tellurian: When a hit is produced against a unit, exhaust to cancel that hit.
  onHitsProduced(player, ctx, { targetOwner, systemId, hits, combatType: _combatType }) {
    if (!player.isAgentReady()) {
      return hits
    }

    // Only offer when hits target the Titans player's own units
    if (targetOwner !== player.name) {
      return hits
    }

    if (hits <= 0) {
      return hits
    }

    const choice = ctx.actions.choose(player, ['Exhaust Tellurian', 'Pass'], {
      title: `Tellurian: Exhaust to cancel 1 hit against your units in system ${systemId}?`,
    })

    if (choice[0] === 'Exhaust Tellurian') {
      player.exhaustAgent()

      ctx.log.add({
        template: '{player} exhausts Tellurian to cancel 1 hit (Agent)',
        args: { player },
      })

      return hits - 1
    }

    return hits
  },

  // Commander — Tungstantus: When 1 or more of your units use PRODUCTION,
  // you may gain 1 trade good.
  afterProduction(player, ctx, { unitCount }) {
    if (!player.isCommanderUnlocked()) {
      return
    }

    if (unitCount <= 0) {
      return
    }

    player.addTradeGoods(1)
    ctx.log.add({
      template: 'Tungstantus: {player} gains 1 trade good',
      args: { player: player.name },
    })
  },

  checkCoalescenceOnPlanet(player, ctx, { systemId, planetId, moverName }) {
    const planetUnits = ctx.state.units[systemId]?.planets[planetId] || []
    for (const unit of planetUnits) {
      if (unit.owner === moverName) {
        continue
      }
      if (unit.owner === player.name && unit.type === 'mech') {
        return true
      }
    }
    return false
  },
}
