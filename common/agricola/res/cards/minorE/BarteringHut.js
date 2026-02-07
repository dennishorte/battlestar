module.exports = {
  id: "bartering-hut-e009",
  name: "Bartering Hut",
  deck: "minorE",
  number: 9,
  type: "minor",
  cost: {},
  text: "Up to two times: Immediately spend any 2/3/4 building resources for 1 sheep/wild boar/cattle from the general supply.",
  onPlay(game, player) {
    game.actions.barteringHut(player, this)
  },
}
