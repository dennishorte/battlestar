module.exports = {
  id: "furrows-d003",
  name: "Furrows",
  deck: "minorD",
  number: 3,
  type: "minor",
  cost: {},
  category: "Crop Provider",
  text: "You can immediately sow in exactly 1 field.",
  onPlay(game, player) {
    game.actions.sowSingleField(player, this)
  },
}
