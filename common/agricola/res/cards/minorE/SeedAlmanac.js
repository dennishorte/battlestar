module.exports = {
  id: "seed-almanac-e018",
  name: "Seed Almanac",
  deck: "minorE",
  number: 18,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { occupations: 4 },
  text: "Each time after you play a minor improvement after this one, you can pay 1 food to plow 1 field.",
  matches_onBuildImprovement(_game, player, _cost, card) {
    return card && card.type === 'minor' && card.id !== this.id && player.food >= 1
  },
  onBuildImprovement(game, player, _cost, _card) {
    const validSpaces = player.getValidPlowSpaces()
    if (validSpaces.length > 0) {
      const selection = game.actions.choose(player, [
        game.actions.option({ id: 'pay', title: 'Pay 1 food to plow 1 field' }),
        game.actions.option({ id: 'skip', title: 'Skip' }),
      ], {
        title: 'Seed Almanac',
        min: 1,
        max: 1,
      })
      if (selection[0].id !== 'skip') {
        player.payCost({ food: 1 })
        game.actions.plowField(player)
        game.log.add({
          template: '{player} plows a field',
          args: { player },
        })
      }
    }
  },
}
