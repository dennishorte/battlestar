module.exports = {
  id: "pole-barns-e001",
  name: "Pole Barns",
  deck: "minorE",
  number: 1,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { fences: 15 },
  text: "You can immediately build up to 3 stables at no cost.",
  onPlay(game, player) {
    game.actions.buildFreeStables(player, this, 3)
  },
}
