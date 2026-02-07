module.exports = {
  id: "field-spade-e079",
  name: "Field Spade",
  deck: "minorE",
  number: 79,
  type: "minor",
  cost: { wood: 1 },
  text: "Each time after you sow in at least 1 field, you get 1 stone.",
  onSow(game, player, types) {
    if (types && types.length > 0) {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Field Spade',
        args: { player },
      })
    }
  },
}
