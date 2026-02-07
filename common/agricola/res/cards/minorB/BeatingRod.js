module.exports = {
  id: "beating-rod-b009",
  name: "Beating Rod",
  deck: "minorB",
  number: 9,
  type: "minor",
  cost: {},
  category: "Building Resource Provider",
  text: "You can immediately choose to either get 1 reed or exchange 1 reed for 1 cattle.",
  onPlay(game, player) {
    game.actions.offerBeatingRod(player, this)
  },
}
