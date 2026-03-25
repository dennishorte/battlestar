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
  matches_onSow(_game, _player, isUnconditional) {
    return isUnconditional
  },
  onSow(game, player, _isUnconditional) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain',
      args: { player },
    })
  },
}
