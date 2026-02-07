module.exports = {
  id: "rock-beater-e150",
  name: "Rock Beater",
  deck: "occupationE",
  number: 150,
  type: "occupation",
  players: "1+",
  text: "You can use an action space providing both stone and a different building resource even if it is occupied by another player. Stone rooms cost you 2 stone less each.",
  allowsIgnoreOccupied(player, actionId, game) {
    return game.actionSpaceProvidesStoneAndOther(actionId)
  },
  modifyRoomCost(player, cost) {
    if (player.roomType === 'stone' && cost.stone && cost.stone > 0) {
      return { ...cost, stone: Math.max(0, cost.stone - 2) }
    }
    return cost
  },
}
