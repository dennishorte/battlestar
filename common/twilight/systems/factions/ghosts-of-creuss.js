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
}
