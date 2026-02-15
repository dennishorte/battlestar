module.exports = {
  id: "organic-farmer-b098",
  name: "Organic Farmer",
  deck: "occupationB",
  number: 98,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each pasture containing at least 1 animal while having unused capacity for at least three more animals.",
  getEndGamePoints(player) {
    let count = 0
    for (const pasture of player.farmyard.pastures) {
      const animals = pasture.animalCount || 0
      const capacity = player.getPastureCapacity(pasture)
      if (animals >= 1 && (capacity - animals) >= 3) {
        count++
      }
    }
    return count
  },
}
