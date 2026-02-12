module.exports = {
  id: "apiary-e023",
  name: "Apiary",
  deck: "minorE",
  number: 23,
  type: "minor",
  cost: {},
  prereqs: { occupations: 4 },
  text: "At the end of each work phase, you can sow exactly 1 crop on 1 field.",
  onWorkPhaseEnd(game, player) {
    const emptyFields = player.getEmptyFields()
    if (emptyFields.length > 0 && (player.grain >= 1 || player.vegetables >= 1)) {
      const selection = game.actions.choose(player, [
        'Sow 1 field',
        'Skip',
      ], {
        title: 'Apiary',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        game.actions.sowSingleField(player, this)
      }
    }
  },
}
