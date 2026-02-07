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
    player.turnwrestPlowCharges = 2
    game.log.add({
      template: '{player} places 2 field tiles on Turnwrest Plow',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if ((actionId === 'plow-field' || actionId === 'plow-sow') && player.turnwrestPlowCharges > 0) {
      const fieldsToAdd = Math.min(2, player.turnwrestPlowCharges)
      player.turnwrestPlowCharges -= fieldsToAdd
      for (let i = 0; i < fieldsToAdd; i++) {
        game.actions.plowField(player, { immediate: true })
      }
    }
  },
}
