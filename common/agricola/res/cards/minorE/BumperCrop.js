module.exports = {
  id: "bumper-crop-e025",
  name: "Bumper Crop",
  deck: "minorE",
  number: 25,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { grainFields: 2 },
  text: "When you play this card, immediately play the field phase of the harvest on your farmyard only.",
  onPlay(game, player) {
    game.actions.harvestFields(player)
  },
}
