module.exports = {
  id: "retraining-d027",
  name: "Retraining",
  deck: "minorD",
  number: 27,
  type: "minor",
  cost: { food: 1 },
  vps: 1,
  prereqs: { occupations: 1 },
  category: "Actions Booster",
  text: "At the end of each turn in which you renovate, you can exchange your Joinery for the Pottery or your Pottery for the Basketmaker's Workshop.",
  onRenovate(game, player) {
    game.actions.offerRetraining(player, this)
  },
}
