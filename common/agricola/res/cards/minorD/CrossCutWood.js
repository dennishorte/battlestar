module.exports = {
  id: "cross-cut-wood-d004",
  name: "Cross-Cut Wood",
  deck: "minorD",
  number: 4,
  type: "minor",
  cost: { food: 1 },
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "You immediately get a number of wood equal to the number of stone in your supply.",
  onPlay(game, player) {
    const stone = player.stone || 0
    if (stone > 0) {
      player.addResource('wood', stone)
      game.log.add({
        template: '{player} gets {amount} wood from Cross-Cut Wood',
        args: { player, amount: stone },
      })
    }
  },
}
