module.exports = {
  votesFirst: true,

  getVotingModifier(player, ctx) {
    return ctx.players.all().length
  },

  getRaidFormationExcessHits(player, ctx, totalHits, fightersDestroyed) {
    return Math.max(0, totalHits - fightersDestroyed)
  },
}
