module.exports = {
  id: "chimney-sweep-d154",
  name: "Chimney Sweep",
  deck: "occupationD",
  number: 154,
  type: "occupation",
  players: "1+",
  text: "Renovating to stone costs you 2 stone less. During scoring, you get 1 bonus point for each other player living in a stone house.",
  modifyRenovationCost(player, cost, toType) {
    if (toType === 'stone' && cost.stone && cost.stone > 0) {
      return { ...cost, stone: Math.max(0, cost.stone - 2) }
    }
    return cost
  },
  getEndGamePoints(player, game) {
    return game.players.all().filter(p => p.name !== player.name && p.roomType === 'stone').length
  },
}
