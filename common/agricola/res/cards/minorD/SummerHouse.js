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
      const unusedAdjacentToHouse = player.getUnusedSpacesAdjacentToHouse()
      return unusedAdjacentToHouse * 2
    }
    return 0
  },
}
