module.exports = {
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
    if (!creussPlayer.isAgentReady()) {
      return
    }

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
    if (nonDeltaWormholes.length === 0) {
      return
    }

    const choice = ctx.actions.choose(creussPlayer, ['Exhaust Emissary Taivra', 'Pass'], {
      title: `Emissary Taivra: Make system ${systemId} adjacent to all wormhole systems?`,
    })

    if (choice[0] !== 'Exhaust Emissary Taivra') {
      return
    }

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
}
