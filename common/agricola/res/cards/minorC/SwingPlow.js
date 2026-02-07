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
    player.swingPlowCharges = 4
    game.log.add({
      template: '{player} places 4 field tiles on Swing Plow',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'plow-field' && player.swingPlowCharges > 0) {
      const fieldsToAdd = Math.min(2, player.swingPlowCharges)
      player.swingPlowCharges -= fieldsToAdd
      for (let i = 0; i < fieldsToAdd; i++) {
        game.actions.plowField(player, { immediate: true })
      }
    }
  },
}
