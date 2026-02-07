module.exports = {
  id: "homekeeper-a085",
  name: "Homekeeper",
  deck: "occupationA",
  number: 85,
  type: "occupation",
  players: "1+",
  text: "Exactly one clay or stone room in your house can hold an additional person if the room is adjacent to both a field and a pasture.",
  modifyRoomCapacity(game, player, room) {
    if ((player.roomType === 'clay' || player.roomType === 'stone') &&
          player.isRoomAdjacentToField(room) &&
          player.isRoomAdjacentToPasture(room)) {
      return 1 // One room can hold +1 person
    }
    return 0
  },
}
