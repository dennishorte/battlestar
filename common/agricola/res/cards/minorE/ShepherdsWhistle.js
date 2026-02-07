module.exports = {
  id: "shepherds-whistle-e083",
  name: "Shepherd's Whistle",
  deck: "minorE",
  number: 83,
  type: "minor",
  cost: { wood: 1 },
  text: "At the start of the breeding phase of each harvest, if you have at least 1 unfenced stable without an animal, you get 1 sheep.",
  onBreedingPhaseStart(game, player) {
    if (player.hasEmptyUnfencedStable()) {
      player.addAnimal('sheep', 1)
      game.log.add({
        template: "{player} gets 1 sheep from Shepherd's Whistle",
        args: { player },
      })
    }
  },
}
