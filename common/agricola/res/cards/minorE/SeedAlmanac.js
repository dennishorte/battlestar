module.exports = {
  id: "seed-almanac-e018",
  name: "Seed Almanac",
  deck: "minorE",
  number: 18,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { occupations: 4 },
  text: "Each time after you play a minor improvement after this one, you can pay 1 food to plow 1 field.",
  onBuildImprovement(game, player, cost, card) {
    if (card && card.type === 'minor' && card.id !== this.id && player.food >= 1) {
      const validSpaces = player.getValidPlowSpaces()
      if (validSpaces.length > 0) {
        const selection = game.actions.choose(player, [
          'Pay 1 food to plow 1 field',
          'Skip',
        ], {
          title: 'Seed Almanac',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          player.payCost({ food: 1 })
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
