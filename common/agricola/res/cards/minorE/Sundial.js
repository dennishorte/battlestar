module.exports = {
  id: "sundial-e026",
  name: "Sundial",
  deck: "minorE",
  number: 26,
  type: "minor",
  cost: { wood: 1 },
  text: "At the end of the work phases in rounds 7 and 9, you can take a \"Sow\" action without placing a person.",
  onWorkPhaseEnd(game, player) {
    if (game.state.round === 7 || game.state.round === 9) {
      game.actions.offerFreeSow(player, this)
    }
  },
}
