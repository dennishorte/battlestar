module.exports = {
  id: "overhaul-c001",
  name: "Overhaul",
  deck: "minorC",
  number: 1,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 2 },
  category: "Farm Planner",
  text: "Immediately raze all of your fences, add up to 3 fences from your supply, and rebuild them. (You do not lose any animals during this.)",
  onPlay(game, player) {
    game.actions.overhaulFences(player, this)
  },
}
