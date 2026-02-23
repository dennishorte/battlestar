module.exports = {
  // Guild Ships: trade with non-neighbors
  canTradeWithNonNeighbors() {
    return true
  },

  // Masters of Trade: free Trade secondary
  canSkipTradeSecondaryCost() {
    return true
  },

  // Arbiters: action cards can be traded
  canTradeActionCards() {
    return true
  },

  // Agent: Carth of Golden Sands — component action to gain 2 commodities or replenish another
  componentActions: [
    {
      id: 'carth-agent',
      name: 'Carth of Golden Sands',
      abilityId: 'guild-ships', // Any Hacan ability, just needs to match
      isAvailable: function(player) {
        return player.isAgentReady()
      },
    },
  ],

  carthAgent(ctx, player) {
    player.exhaustAgent()

    const others = ctx.players.all().filter(p => p.name !== player.name).map(p => p.name)
    const options = ['Gain 2 Commodities', ...others.map(n => `Replenish ${n}`)]

    const choice = ctx.actions.choose(player, options, {
      title: 'Carth of Golden Sands: Gain 2 commodities or replenish another player?',
    })

    if (choice[0] === 'Gain 2 Commodities') {
      const toGain = Math.min(2, player.maxCommodities - player.commodities)
      player.commodities += toGain
      ctx.log.add({
        template: 'Carth of Golden Sands: {player} gains {count} commodities',
        args: { player: player.name, count: toGain },
      })
    }
    else {
      // Replenish another player's commodities
      const targetName = choice[0].replace('Replenish ', '')
      const target = ctx.players.byName(targetName)
      if (target) {
        target.commodities = target.maxCommodities
        ctx.log.add({
          template: 'Carth of Golden Sands: {player} replenishes {target} commodities',
          args: { player: player.name, target: targetName },
        })
      }
    }
  },

  // Commander: Gila the Silvertongue — spend TG for 2x votes (handled in agenda phase)
  commanderEffect: {
    timing: 'transaction-bonus',
    apply: (player, _context) => {
      player.addTradeGoods(1)
    },
  },
}
