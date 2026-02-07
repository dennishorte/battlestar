module.exports = {
  id: "final-scenario-b023",
  name: "Final Scenario",
  deck: "minorB",
  number: 23,
  type: "minor",
  cost: {},
  prereqs: { maxRound: 13 },
  category: "Actions Booster",
  text: "Place the action space card for round 14 face up in front of you. Only you can use it until it is placed on the game board.",
  onPlay(game, player) {
    player.finalScenarioActive = true
    game.log.add({
      template: '{player} claims exclusive access to round 14 action space via Final Scenario',
      args: { player },
    })
  },
}
