module.exports = {
  id: "credit-a054",
  name: "Credit",
  deck: "minorA",
  number: 54,
  type: "minor",
  cost: {},
  prereqs: { occupations: 3, occupationsAtMost: true },
  category: "Food Provider",
  text: "When you play this card, you immediately get 5 food. At the end of each round that does not end with a harvest, you must pay 1 food, or else take a begging marker.",
  onPlay(game, player) {
    player.addResource('food', 5)
    player.creditActive = true
    game.log.add({
      template: '{player} gets 5 food from Credit',
      args: { player },
    })
  },
  onRoundEnd(game, player, round) {
    if (player.creditActive && !game.isHarvestRound(round)) {
      if (player.food >= 1) {
        player.removeResource('food', 1)
        game.log.add({
          template: '{player} pays 1 food for Credit',
          args: { player },
        })
      }
      else {
        player.beggingMarkers = (player.beggingMarkers || 0) + 1
        game.log.add({
          template: '{player} takes a begging marker (Credit)',
          args: { player },
        })
      }
    }
  },
}
