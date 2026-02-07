module.exports = {
  id: "woolgrower-a148",
  name: "Woolgrower",
  deck: "occupationA",
  number: 148,
  type: "occupation",
  players: "3+",
  text: "This card can hold a number of sheep equal to the number of completed feeding phases.",
  holdsAnimals: { sheep: true },
  getAnimalCapacity(game) {
    return game.getCompletedFeedingPhases()
  },
}
