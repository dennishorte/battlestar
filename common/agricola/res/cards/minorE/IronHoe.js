module.exports = {
  id: "iron-hoe-e020",
  name: "Iron Hoe",
  deck: "minorE",
  number: 20,
  type: "minor",
  cost: { wood: 1 },
  text: "At the end of each work phase, if you occupy both the \"Grain Seeds\" and \"Vegetable Seeds\" action spaces, you can plow 1 field.",
  onWorkPhaseEnd(game, player) {
    const grainSpace = game.state.actionSpaces['take-grain']
    const vegSpace = game.state.actionSpaces['take-vegetable']
    if (grainSpace?.occupiedBy === player.name && vegSpace?.occupiedBy === player.name) {
      const validSpaces = player.getValidPlowSpaces()
      if (validSpaces.length > 0) {
        const selection = game.actions.choose(player, [
          'Plow 1 field',
          'Skip',
        ], {
          title: 'Iron Hoe',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
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
