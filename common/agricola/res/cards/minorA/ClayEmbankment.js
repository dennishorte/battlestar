module.exports = {
  id: "clay-embankment-a005",
  name: "Clay Embankment",
  deck: "minorA",
  number: 5,
  type: "minor",
  cost: { food: 1 },
  passLeft: true,
  category: "Building Resource Provider",
  text: "You immediately get 1 clay for every 2 clay you already have in your supply.",
  onPlay(game, player) {
    const bonus = Math.floor(player.clay / 2)
    if (bonus > 0) {
      player.addResource('clay', bonus)
      game.log.add({
        template: '{player} gets {amount} clay from Clay Embankment',
        args: { player, amount: bonus },
      })
    }
  },
}
