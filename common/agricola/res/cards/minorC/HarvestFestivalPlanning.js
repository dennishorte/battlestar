module.exports = {
  id: "harvest-festival-planning-c072",
  name: "Harvest Festival Planning",
  deck: "minorC",
  number: 72,
  type: "minor",
  cost: { food: 1 },
  prereqs: { occupations: 2 },
  category: "Actions Booster",
  text: "When you play this card, immediately carry out the field phase of the harvest. Afterwards, you get a \"Major or Minor Improvement\" action.",
  onPlay(game, player) {
    game.actions.harvestFieldPhase(player)
    game.actions.majorOrMinorImprovement(player)
  },
}
