module.exports = {
  id: "turnip-farmer-a141",
  name: "Turnip Farmer",
  deck: "occupationA",
  number: 141,
  type: "occupation",
  players: "3+",
  text: "At the start of the returning home phase of each round, if both the \"Day Laborer\" and \"Grain Seeds\" action spaces are occupied, you get 1 vegetable.",
  matches_onReturnHomeStart(game, _player) {
    return game.isActionOccupied('day-laborer') && game.isActionOccupied('take-grain')
  },
  onReturnHomeStart(game, player) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable from {card}',
      args: { player , card: this},
    })
  },
}
