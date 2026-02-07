module.exports = {
  id: "wooden-hut-extender-c128",
  name: "Wooden Hut Extender",
  deck: "occupationC",
  number: 128,
  type: "occupation",
  players: "1+",
  text: "Wood rooms now cost you 1 reed, and additionally 5 wood through round 5, 4 wood in rounds 6 and 7, and 3 wood in round 8 and later.",
  modifyRoomCost(player, cost, round) {
    if (player.roomType === 'wood') {
      let woodCost = 5
      if (round >= 8) {
        woodCost = 3
      }
      else if (round >= 6) {
        woodCost = 4
      }
      return { wood: woodCost, reed: 1 }
    }
    return cost
  },
}
