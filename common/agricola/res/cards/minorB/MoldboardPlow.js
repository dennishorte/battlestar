module.exports = {
  id: "moldboard-plow-b019",
  name: "Moldboard Plow",
  deck: "minorB",
  number: 19,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 1 },
  category: "Farm Planner",
  text: "Place 2 field tiles on this card. Twice this game, when you use the \"Farmland\" action space, you can also plow 1 field from this card.",
  onPlay(game, player) {
    player.moldboardPlowCharges = 2
    game.log.add({
      template: '{player} places 2 field tiles on Moldboard Plow',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'plow-field' && player.moldboardPlowCharges > 0) {
      player.moldboardPlowCharges--
      game.actions.plowField(player, { immediate: true })
    }
  },
}
