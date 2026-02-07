module.exports = {
  id: "straw-hat-e010",
  name: "Straw Hat",
  deck: "minorE",
  number: 10,
  type: "minor",
  cost: { reed: 1 },
  text: "At the end of the work phases of rounds 3 and 6, you can move your person from the \"Farmland\" action space to an unoccupied action space and take that action, or get 1 food.",
  onWorkPhaseEnd(game, player) {
    if (game.state.round === 3 || game.state.round === 6) {
      game.actions.strawHatBonus(player, this)
    }
  },
}
