module.exports = {
  id: "carriage-trip-c003",
  name: "Carriage Trip",
  deck: "minorC",
  number: 3,
  type: "minor",
  cost: {},
  prereqs: { personYetToPlace: true },
  category: "Actions Booster",
  text: "If you play this card in the work phase, you can immediately place another person.",
  onPlay(game, player) {
    game.actions.placeExtraPerson(player, this)
  },
}
