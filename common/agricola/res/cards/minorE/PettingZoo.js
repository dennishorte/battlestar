module.exports = {
  id: "petting-zoo-e011",
  name: "Petting Zoo",
  deck: "minorE",
  number: 11,
  type: "minor",
  cost: { wood: 1 },
  text: "As long as you have a pasture orthogonally adjacent to your house, you can keep animals of any type on this card, up to the number of rooms in your house.",
  holdsAnimals: true,
  mixedAnimals: true,
  getAnimalCapacity(player) {
    if (player.hasPastureAdjacentToHouse()) {
      return player.getRoomCount()
    }
    return 0
  },
}
