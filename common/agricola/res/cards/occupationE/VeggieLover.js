module.exports = {
  id: "veggie-lover-e132",
  name: "Veggie Lover",
  deck: "occupationE",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "In each harvest, you can use this card to exchange a pair of 1 grain and 1 vegetable into 6 food. During scoring, you can exchange 1/2/3 pairs of 1 grain and 1 vegetable for 2/4/6 bonus points.",
  onHarvest(game, player) {
    if (player.grain >= 1 && player.vegetables >= 1) {
      game.actions.offerVeggieLoverHarvestConversion(player, this)
    }
  },
  onScoring(game, player) {
    game.actions.offerVeggieLoverScoringConversion(player, this)
  },
}
