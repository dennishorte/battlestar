module.exports = {
  id: "ox-goad-e019",
  name: "Ox Goad",
  deck: "minorE",
  number: 19,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 3 },
  text: "Each time after you use the \"Cattle Market\" accumulation space, you can pay 2 food to plow 1 field.",
  onAction(game, player, actionId) {
    if (actionId === 'take-cattle' && player.food >= 2) {
      const validSpaces = player.getValidPlowSpaces()
      if (validSpaces.length > 0) {
        const selection = game.actions.choose(player, [
          'Pay 2 food to plow 1 field',
          'Skip',
        ], {
          title: 'Ox Goad',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          player.payCost({ food: 2 })
          game.actions.plowField(player)
          game.log.add({
            template: '{player} plows a field using {card}',
            args: { player, card: this },
          })
        }
      }
    }
  },
}
