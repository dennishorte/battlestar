module.exports = {
  id: "luxurious-hostel-d034",
  name: "Luxurious Hostel",
  deck: "minorD",
  number: 34,
  type: "minor",
  cost: { wood: 1, clay: 2 },
  category: "Points Provider",
  text: "During scoring, if you then have more stone rooms than people, you get 4 bonus points. You can only use one card to get bonus points for your stone house.",
  getEndGamePoints(player) {
    if (player.roomType === 'stone' && player.getRoomCount() > player.familyMembers) {
      return 4
    }
    return 0
  },
}
