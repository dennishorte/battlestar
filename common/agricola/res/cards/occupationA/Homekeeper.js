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
      // Exactly one room gets the bonus: the lexicographically first that qualifies
      const rooms = player.getRoomSpaces()
      for (const r of rooms) {
        if (r.row < room.row || (r.row === room.row && r.col < room.col)) {
          if (player.isRoomAdjacentToField(r) && player.isRoomAdjacentToPasture(r)) {
            return 0 // an earlier room already qualifies
          }
        }
      }
      return 1
    }
    return 0
  },
}
