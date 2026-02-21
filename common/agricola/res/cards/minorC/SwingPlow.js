module.exports = {
  id: "swing-plow-c019",
  name: "Swing Plow",
  deck: "minorC",
  number: 19,
  type: "minor",
  cost: { wood: 3 },
  prereqs: { occupations: 3 },
  category: "Farm Planner",
  text: "Place 4 field tiles on this card. Each time you use the \"Farmland\" action space, you can also plow up to 2 fields from this card.",
  onPlay(game, player) {
    game.cardState(this.id).charges = 4
    game.log.add({
      template: '{player} places 4 field tiles on {card}',
      args: { player , card: this},
    })
  },
  onAction(game, player, actionId) {
    const state = game.cardState(this.id)
    if (actionId !== 'plow-field' || state.charges <= 0) {
      return
    }

    const maxPlows = Math.min(2, state.charges)
    for (let i = 0; i < maxPlows; i++) {
      if (player.getValidPlowSpaces().length === 0) {
        break
      }
      const selection = game.actions.choose(player, [
        `Plow a field from Swing Plow (${state.charges} remaining)`,
        'Skip',
      ], {
        title: 'Swing Plow',
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
