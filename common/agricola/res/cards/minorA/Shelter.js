module.exports = {
  id: "shelter-a001",
  name: "Shelter",
  deck: "minorA",
  number: 1,
  type: "minor",
  cost: {},
  category: "Farm Planner",
  text: "You can immediately build a stable at no cost, but only if you place it in a pasture covering exactly 1 farmyard space.",
  onPlay(game, player) {
    const singleSpacePastures = (player.farmyard.pastures || []).filter(p => p.spaces.length === 1 && !player.hasStableAt(p.spaces[0]))
    if (singleSpacePastures.length > 0) {
      game.actions.offerBuildFreeStableInSinglePasture(player, this, singleSpacePastures)
    }
  },
}
