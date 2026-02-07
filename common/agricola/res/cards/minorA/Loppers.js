module.exports = {
  id: "loppers-a034",
  name: "Loppers",
  deck: "minorA",
  number: 34,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "Each time you build 1 or more fences, you can also use this card to exchange 1 wood and 1 fence in your supply for 2 food and 1 bonus point.",
  onBuildFences(game, player) {
    if (player.wood >= 1 && player.getFencesInSupply() >= 1) {
      game.actions.offerLoppers(player, this)
    }
  },
}
