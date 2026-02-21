module.exports = {
  id: "seed-pellets-a065",
  name: "Seed Pellets",
  deck: "minorA",
  number: 65,
  type: "minor",
  cost: {},
  prereqs: { fields: 3 },
  category: "Crop Provider",
  text: "Each time before you take an unconditional \"Sow\" action, you get 1 grain.",
  onSow(game, player, isUnconditional) {
    if (isUnconditional) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
  },
}
