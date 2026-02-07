module.exports = {
  id: "patroness-e163",
  name: "Patroness",
  deck: "occupationE",
  number: 163,
  type: "occupation",
  players: "1+",
  text: "Each time after you play an occupation after this one, you get 1 building resource of your choice.",
  onPlayOccupation(game, player) {
    game.actions.offerBuildingResourceChoice(player, this)
  },
}
