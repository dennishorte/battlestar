module.exports = {
  id: "truffle-slicer-d039",
  name: "Truffle Slicer",
  deck: "minorD",
  number: 39,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { minRound: 8 },
  category: "Points Provider",
  text: "Each time you use a wood accumulation space, if you have at least 1 wild boar, you can pay 1 food for 1 bonus point.",
  onAction(game, player, actionId) {
    if ((actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') &&
          player.getTotalAnimals('boar') >= 1 && player.food >= 1) {
      game.actions.offerTruffleSlicer(player, this)
    }
  },
}
