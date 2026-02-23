module.exports = {
  afterCombatResolved(player, ctx, { loserName }) {
    if (!ctx.state.capturedCommandTokens[player.name]) {
      ctx.state.capturedCommandTokens[player.name] = []
    }
    ctx.state.capturedCommandTokens[player.name].push(loserName)

    ctx.log.add({
      template: '{player} captures {loser} command token (Edict)',
      args: { player, loser: loserName },
    })
  },

  getCapturedTokenFleetBonus(player, ctx) {
    return (ctx.state.capturedCommandTokens[player.name] || []).length
  },
}
