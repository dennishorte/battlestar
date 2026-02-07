module.exports = {
  id: "perennial-rye-c084",
  name: "Perennial Rye",
  deck: "minorC",
  number: 84,
  type: "minor",
  cost: { food: 1 },
  prereqs: { occupations: 2 },
  category: "Livestock Provider",
  text: "Each round that does not end with a harvest, you can pay 1 grain to breed exactly 1 type of animal. (This is not considered a breeding phase.)",
  onRoundEnd(game, player, round) {
    if (!game.isHarvestRound(round) && player.grain >= 1) {
      game.actions.offerPerennialRye(player, this)
    }
  },
}
