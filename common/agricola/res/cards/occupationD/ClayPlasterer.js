module.exports = {
  id: "clay-plasterer-d121",
  name: "Clay Plasterer",
  deck: "occupationD",
  number: 121,
  type: "occupation",
  players: "1+",
  text: "Renovating to clay only costs you exactly 1 clay and 1 reed. Each clay room only costs you 3 clay and 2 reed to build.",
  modifyRenovationCost(game, player, cost, { toType }) {
    if (toType === 'clay') {
      return { clay: 1, reed: 1 }
    }
    return cost
  },
  modifyRoomCost(player, cost) {
    if (player.roomType === 'clay') {
      return { clay: 3, reed: 2 }
    }
    return cost
  },
}
