module.exports = {
  id: "half-timbered-house-c030",
  name: "Half-Timbered House",
  deck: "minorC",
  number: 30,
  type: "minor",
  cost: {
    wood: 1,
    clay: 1,
    stone: 2,
    reed: 1,
  },
  category: "Points Provider",
  text: "During scoring, you get 1 bonus point for each stone room you have. You can only use one card to get bonus points for your stone house.",
  getEndGamePoints(player) {
    if (player.roomType === 'stone') {
      return player.getRoomCount()
    }
    return 0
  },
}
