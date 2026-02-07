module.exports = {
  id: "silage-a084",
  name: "Silage",
  deck: "minorA",
  number: 84,
  type: "minor",
  cost: {},
  prereqs: { fields: 2 },
  category: "Livestock Provider",
  text: "In each returning home phase after which there is no harvest, you can pay exactly 1 grain - even from a field - to breed exactly one type of animal.",
  onReturnHome(game, player) {
    const round = game.state.round
    if (!game.isHarvestRound(round)) {
      const canPayGrain = player.grain >= 1 || player.getGrainFieldCount() > 0
      if (canPayGrain) {
        game.actions.offerSilage(player, this)
      }
    }
  },
}
