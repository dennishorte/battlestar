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
      if (player.canSowAnything()) {
        const selection = game.actions.choose(player, [
          game.actions.option({ id: 'sow', title: 'Take a Sow action' }),
          game.actions.option({ id: 'skip', title: 'Skip' }),
        ], { title: 'Sundial', min: 1, max: 1 })
        if (selection[0].id !== 'skip') {
          game.actions.sow(player)
          game.log.add({
            template: '{player} takes a free Sow action via {card}',
            args: { player , card: this},
          })
        }
      }
    }
  },
}
