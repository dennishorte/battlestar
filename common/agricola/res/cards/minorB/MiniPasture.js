module.exports = {
  id: "mini-pasture-b002",
  name: "Mini Pasture",
  deck: "minorB",
  number: 2,
  type: "minor",
  cost: { food: 2 },
  passLeft: true,
  category: "Farm Planner",
  text: "Immediately fence a farmyard space, without paying wood for the fences. (If you already have pastures, the new one must be adjacent to an existing one.)",
  onPlay(game, player) {
    game.actions.buildFreeSingleSpacePasture(player, this)
  },
}
