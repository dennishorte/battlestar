module.exports = {
  id: "bunk-beds-c010",
  name: "Bunk Beds",
  deck: "minorC",
  number: 10,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { majorImprovements: 2 },
  category: "Farm Planner",
  text: "Once you have 4 rooms, your house can hold 5 people.",
  modifyHouseCapacity(player, capacity) {
    if (player.getRoomCount() >= 4) {
      return Math.max(capacity, 5)
    }
    return capacity
  },
}
