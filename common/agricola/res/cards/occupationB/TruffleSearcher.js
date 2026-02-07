module.exports = {
  id: "truffle-searcher-b086",
  name: "Truffle Searcher",
  deck: "occupationB",
  number: 86,
  type: "occupation",
  players: "1+",
  text: "This card can hold a number of wild boar equal to the number of completed feeding phases.",
  holdsAnimals: { boar: true },
  getAnimalCapacity(game) {
    return game.getCompletedFeedingPhases()
  },
}
