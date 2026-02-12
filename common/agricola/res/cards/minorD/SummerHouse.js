module.exports = {
  id: "summer-house-d033",
  name: "Summer House",
  deck: "minorD",
  number: 33,
  type: "minor",
  cost: { wood: 3, stone: 1 },
  prereqs: { houseType: "wood" },
  category: "Points Provider",
  text: "During scoring, if you live in a stone house, you get 2 bonus points for each unused farmyard space orthogonally adjacent to your house. (You still lose the points for these unused spaces.)",
  getEndGamePoints(player) {
    if (player.roomType === 'stone') {
      const rooms = player.getRoomSpaces()
      const seen = new Set()
      let count = 0
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      for (const room of rooms) {
        for (const [dr, dc] of directions) {
          const nr = room.row + dr
          const nc = room.col + dc
          const key = `${nr},${nc}`
          if (nr >= 0 && nr < 3 && nc >= 0 && nc < 5 && !seen.has(key)) {
            seen.add(key)
            const space = player.farmyard.grid[nr][nc]
            if (space.type === 'empty' && !space.hasStable && !player.getPastureAtSpace(nr, nc)) {
              count++
            }
          }
        }
      }
      return count * 2
    }
    return 0
  },
}
