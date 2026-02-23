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
