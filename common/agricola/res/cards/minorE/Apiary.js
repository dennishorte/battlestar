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
    game.actions.offerSowSingleField(player, this)
  },
}
