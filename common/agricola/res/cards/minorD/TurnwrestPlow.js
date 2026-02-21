module.exports = {
  id: "turnwrest-plow-d020",
  name: "Turnwrest Plow",
  deck: "minorD",
  number: 20,
  type: "minor",
  cost: { wood: 3 },
  prereqs: { occupations: 2 },
  category: "Farm Planner",
  text: "Place 2 field tiles on this card. Each time you use the \"Farmland\" or \"Cultivation\" action space, you can also plow up to 2 fields from this card.",
  onPlay(game, player) {
    game.cardState(this.id).charges = 2
    game.log.add({
      template: '{player} places 2 field tiles on {card}',
      args: { player , card: this},
    })
  },
  onAction(game, player, actionId) {
    const state = game.cardState(this.id)
    if ((actionId !== 'plow-field' && actionId !== 'plow-sow') || state.charges <= 0) {
      return
    }

    const maxPlows = Math.min(2, state.charges)
    for (let i = 0; i < maxPlows; i++) {
      if (player.getValidPlowSpaces().length === 0) {
        break
      }
      const selection = game.actions.choose(player, [
        `Plow a field from Turnwrest Plow (${state.charges} remaining)`,
        'Skip',
      ], {
        title: 'Turnwrest Plow',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Skip') {
        break
      }
      game.actions.plowField(player)
      state.charges--
    }
  },
}
