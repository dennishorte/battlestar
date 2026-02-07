module.exports = {
  id: "blade-shears-c007",
  name: "Blade Shears",
  deck: "minorC",
  number: 7,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { pastures: 1 },
  category: "Food Provider",
  text: "You immediately get your choice of 3 food or 1 food for each sheep you have. (Keep the sheep.)",
  onPlay(game, player) {
    game.actions.bladeShearsChoice(player, this)
  },
}
