module.exports = {
  id: "carpenter-b126",
  name: "Carpenter",
  deck: "occupationB",
  number: 126,
  type: "occupation",
  players: "1+",
  text: "Every new room only costs you 3 of the appropriate building resource and 2 reed.",
  modifyRoomCost(player, _cost) {
    const material = player.roomType
    return { [material]: 3, reed: 2 }
  },
}
