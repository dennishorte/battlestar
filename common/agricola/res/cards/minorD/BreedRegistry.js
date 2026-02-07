module.exports = {
  id: "breed-registry-d036",
  name: "Breed Registry",
  deck: "minorD",
  number: 36,
  type: "minor",
  cost: {},
  prereqs: { noSheep: true },
  category: "Points Provider",
  text: "During scoring, if you gained at most 2 sheep from sources other than breeding during the game and have not turned any sheep into food, you get 3 bonus points.",
  onPlay(game, player) {
    player.breedRegistryActive = true
    player.sheepGainedNonBreeding = 0
    player.sheepTurnedToFood = 0
  },
  getEndGamePoints(player) {
    if (player.breedRegistryActive && player.sheepGainedNonBreeding <= 2 && player.sheepTurnedToFood === 0) {
      return 3
    }
    return 0
  },
}
